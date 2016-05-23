const config = {}

export function set(name, value)
{
  config[name] = value
}

export function get(name)
{
  return config[name]
}

export function clear(name)
{
  config[name] = null
}
