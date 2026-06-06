# andasy.hcl app configuration file generated for crossfn on Thursday, 26-Mar-26 09:59:21 SAST
#
# See https://github.com/quarksgroup/andasy-cli for information about how to use this file.

app_name = "crossfn"

app {

  env = {}

  port = 80

  primary_region = "fsn"

  compute {
    cpu      = 1
    memory   = 256
    cpu_kind = "shared"
  }

  process {
    name = "crossfn"
  }

}
