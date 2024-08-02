use std::collections::HashSet;
use sysinfo::System;

#[cfg(windows)]
#[tauri::command]
pub async fn get_ide_info() -> Result<HashSet<String>, String> {
    let mut result = HashSet::new();
    let ide_names = [
        "idea64.exe",
        "goland64.exe",
        "pycharm64.exe",
        "devenv.exe",
        "Code.exe",
    ];
    let mut sys = System::new_all();
    sys.refresh_all();
    for (_, pname) in sys.processes().iter() {
        let pname = pname.name().to_str().unwrap();
        if ide_names.contains(&pname) {
            result.insert(pname.to_string());
        }
    }
    Ok(result)
}
