import { exec } from 'child_process';
import { promisify } from 'util';
import { writeFileSync, readFileSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

const execAsync = promisify(exec);

const platform = process.platform;

export async function readClipboard() {
  try {
    if (platform === 'darwin') {
      const { stdout } = await execAsync('pbpaste');
      return { type: 'text', content: stdout };
    } else if (platform === 'win32') {
      const { stdout } = await execAsync('powershell.exe Get-Clipboard -Raw');
      return { type: 'text', content: stdout };
    } else {
      const { stdout } = await execAsync('xclip -selection clipboard -o');
      return { type: 'text', content: stdout };
    }
  } catch (error) {
    return null;
  }
}

export async function writeClipboard(type, content) {
  try {
    if (type === 'text') {
      if (platform === 'darwin') {
        await execAsync(`echo ${JSON.stringify(content)} | pbcopy`);
      } else if (platform === 'win32') {
        await execAsync(`powershell.exe Set-Clipboard -Value ${JSON.stringify(content)}`);
      } else {
        await execAsync(`echo ${JSON.stringify(content)} | xclip -selection clipboard`);
      }
    } else if (type === 'image' || type === 'file') {
      const tempPath = join(tmpdir(), `clipboard-${Date.now()}`);
      const response = await fetch(content);
      const buffer = await response.arrayBuffer();
      writeFileSync(tempPath, Buffer.from(buffer));
      
      if (platform === 'darwin') {
        await execAsync(`osascript -e 'set the clipboard to (read (POSIX file "${tempPath}") as JPEG picture)'`);
      } else if (platform === 'win32') {
        await execAsync(`powershell.exe Set-Clipboard -Path "${tempPath}"`);
      } else {
        await execAsync(`xclip -selection clipboard -t image/png -i "${tempPath}"`);
      }
    }
  } catch (error) {
    console.error('Write clipboard error:', error);
  }
}

export function hashContent(content) {
  return Buffer.from(content).toString('base64').slice(0, 32);
}
