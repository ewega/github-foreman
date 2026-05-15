const fs = require('fs');
const path = require('path');

async function readStdin() {
  return new Promise((resolve, reject) => {
    let data = '';
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', (chunk) => {
      data += chunk;
    });
    process.stdin.on('end', () => resolve(data));
    process.stdin.on('error', reject);
  });
}

function buildResponse(additionalContext, systemMessage) {
  const response = {
    continue: true,
    hookSpecificOutput: {
      hookEventName: 'SessionStart',
      additionalContext,
    },
  };

  if (systemMessage) {
    response.systemMessage = systemMessage;
  }

  return response;
}

async function main() {
  const rawInput = await readStdin();
  let payload = {};

  if (rawInput.trim()) {
    try {
      payload = JSON.parse(rawInput);
    } catch (error) {
      process.stdout.write(JSON.stringify(buildResponse(
        'Foreman could not parse hook input, so resume from Phase 0 and rebuild wave state from repository evidence.',
        `Foreman SessionStart hook could not parse hook input: ${error.message}`
      )));
      return;
    }
  }

  const workspaceRoot = payload.cwd || process.cwd();
  const statePath = path.join(workspaceRoot, '.github', 'foreman', 'wave-state.json');

  if (!fs.existsSync(statePath)) {
    process.stdout.write(JSON.stringify(buildResponse(
      'No prior Foreman wave state was found at .github/foreman/wave-state.json. Begin at Phase 0 and persist wave state before the human gate.',
      undefined
    )));
    return;
  }

  try {
    const stateContents = fs.readFileSync(statePath, 'utf8');
    const state = JSON.parse(stateContents);
    process.stdout.write(JSON.stringify(buildResponse(
      `Foreman resume state was loaded from .github/foreman/wave-state.json. Inspect \`active\` and \`status\`; use this as the primary resume signal only when it describes an in-flight wave, otherwise treat it as historical context before falling back to PR-comment inference.\n${JSON.stringify(state, null, 2)}`,
      undefined
    )));
  } catch (error) {
    process.stdout.write(JSON.stringify(buildResponse(
      'A Foreman wave-state file exists but could not be parsed. Resume from Phase 0 and rebuild state from repository evidence.',
      `Foreman SessionStart hook could not parse .github/foreman/wave-state.json: ${error.message}`
    )));
  }
}

main().catch((error) => {
  process.stdout.write(JSON.stringify(buildResponse(
    'Foreman could not load prior wave state. Resume from Phase 0 and rebuild state from repository evidence.',
    `Foreman SessionStart hook failed: ${error.message}`
  )));
});