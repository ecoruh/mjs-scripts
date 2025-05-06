# sd-import

```text
Usage: sd-import [options]

Import all photos from an SD card to local storage partitioned by year then date.

For example, consider the command "script-sd-import -p ricoh" with:

    source: "/Volumes/RICOH GR/DCIM"
    target: "/Users/fred/Photos"
    regex:  "\d+RICOH"

After the copy the copied image file will be placed in a folder partitioned by
the creation time of your image, ordered by its name (usually sequential.)

For example:

    "~/Photos/2025/2025-04-20/R0001234.DNG"

NOTE: Edit "scripts/.mjs-config/script-sd-import.json" to change or extend your
      profiles.


Options:
  -V, --version           output the version number
  -d, --dryrun            Non-destructive run, listing files only (default: false)
  -p, --profile <string>  Profile key to pull configuration, "leica" or "ricoh"
  -s, --source <string>   Source folder on SD card, eg: "/Volumes/LEICA DSC/DCIM"
  -r, --regex <string>    Image sub-folder regex on SD card, eg: "\d+LEICA"
  -t, --target <string    Target folder on local storage, eg: "/Volumes/V1/Photos"
  -h, --help              display help for command
```
