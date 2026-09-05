import { useEffect } from "react"

import { APP_CONFIG } from "@/constants/app"

export function usePageMeta(title: string, description?: string) {
  useEffect(() => {
    document.title = `${title} | ${APP_CONFIG.name}`

    const metaDescription = document.querySelector<HTMLMetaElement>(
      'meta[name="description"]'
    )

    if (metaDescription && description) {
      metaDescription.content = description
    }
  }, [description, title])
}
