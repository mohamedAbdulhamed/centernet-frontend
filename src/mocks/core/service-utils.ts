export async function resolveMock<T>(value: T, latency = 120) {
  await new Promise((resolve) => {
    window.setTimeout(resolve, latency)
  })

  return value
}

