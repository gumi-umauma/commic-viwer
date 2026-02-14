env "local" {
  src = "file://db/schema"
  url = "postgres://postgres:postgres@localhost:5432/comic_viewer?sslmode=disable"
  dev = "docker://postgres/16/dev"

  format {
    migrate {
      diff = "{{ sql . }}"
    }
  }
}
