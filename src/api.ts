import { invoke } from '@tauri-apps/api/core'

export async function get_ide_info(): Promise<string[] | string> {
  return await invoke('get_ide_info')
}
