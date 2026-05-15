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

function buildAllow(systemMessage) {
  const response = { continue: true };

  if (systemMessage) {
    response.systemMessage = systemMessage;
  }

  return response;
}

function buildBlock() {
  return {
    continue: true,
    systemMessage: 'Foreman stop hook blocked completion because the local wave-state file is missing or older than the current session transcript.',
    hookSpecificOutput: {
      hookEventName: 'Stop',
      decision: 'block',
      reason: 'Persist the current wave state to the local .github/foreman/wave-state.json before finishing.',
    },
  };
}

function stateIsStale(statePath, transcriptPath) {
  if (!fs.existsSync(statePath) || !transcriptPath || !fs.existsSync(transcriptPath)) {
    return false;
  }

  const stateStats = fs.statSync(statePath);
  const transcriptStats = fs.statSync(transcriptPath);

  return transcriptStats.mtimeMs > stateStats.mtimeMs;
}

async function main() {
  const rawInput = await readStdin();
  let payload = {};

  if (rawInput.trim()) {
    try {
      payload = JSON.parse(rawInput);
    } catch (error) {
      process.stdout.write(JSON.stringify(buildAllow(`Foreman Stop hook could not parse hook input: ${error.message}`)));
      return;
    }
  }

  const workspaceRoot = payload.cwd || process.cwd();
  const statePath = path.join(workspaceRoot, '.github', 'foreman', 'wave-state.json');

  if (payload.stop_hook_active) {
    process.stdout.write(JSON.stringify(buildAllow()));
    return;
  }

  if (!stateIsStale(statePath, payload.transcript_path)) {
    process.stdout.write(JSON.stringify(buildAllow()));
    return;
  }

  process.stdout.write(JSON.stringify(buildBlock()));
}

main().catch((error) => {
  process.stdout.write(JSON.stringify(buildAllow(`Foreman Stop hook failed: ${error.message}`)));
});