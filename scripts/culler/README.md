# culler

```text
Usage: culler [options] <folder>

Script to cull image files imported from a camera based on a Mac Finder tag.
This allows large number of poor image files culled after previewing on Finder.

When a jpeg or a raw file is tagged, other similar files will be put to
Mac's Bin. Other file types will be unaffacted.

Default jpeg and raw file extensions are set to 'JPG' and 'DNG' respectively.
But that can be changed via command line options (see --help)


Arguments:
  folder               Path to the image folder

Options:
  -V, --version        output the version number
  -d, --dryrun         Non-destructive run, listing files only
  -j, --jpeg <string>  JPEG file extension, case sensitive (default: "JPG")
  -r, --raw <string>   RAW file extension, case sensitive (default: "DNG")
  -t, --tag <string>   One of Green (default), Blue, Orange, Red, Purple, Grey, Yellow (default: "Green")
  -h, --help           display help for command
```
