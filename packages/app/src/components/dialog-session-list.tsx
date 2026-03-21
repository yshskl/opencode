import { useDialog } from "@opencode-ai/ui/context/dialog"
import { Dialog } from "@opencode-ai/ui/dialog"
import { Icon } from "@opencode-ai/ui/icon"
import { useNavigate } from "@solidjs/router"
import { createMemo, For, Show, createResource } from "solid-js"
import { base64Encode } from "@opencode-ai/util/encode"
import { useSDK } from "@/context/sdk"
import { useLanguage } from "@/context/language"
import { useGlobalSync } from "@/context/global-sync"
import { getRelativeTime } from "@/utils/time"

export function DialogSessionList() {
  const dialog = useDialog()
  const navigate = useNavigate()
  const sdk = useSDK()
  const language = useLanguage()
  const globalSync = useGlobalSync()

  const [search, setSearch] = createSignal("")

  const [sessions, { refetch }] = createResource(search, async (query) => {
    const result = await sdk.client.session.list({
      search: query || undefined,
      limit: 50,
    })
    return result.data ?? []
  })

  const sortedSessions = createMemo(() => {
    const list = sessions() ?? []
    return list
      .filter((x) => !x.parentID)
      .sort((a, b) => b.time.updated - a.time.updated)
  })

  const handleSelect = (session: { id: string; directory: string }) => {
    navigate(`/${base64Encode(session.directory)}/session/${session.id}`)
    dialog.clear()
  }

  return (
    <Dialog title={language.t("command.sessions.title")} onClose={() => dialog.clear()}>
      <div class="flex flex-col gap-2 p-4">
        <div class="flex items-center gap-2">
          <input
            type="text"
            placeholder={language.t("command.sessions.search")}
            class="flex-1 px-3 py-2 bg-surface-base border border-xs-border-base rounded-md text-14-regular text-text-strong placeholder:text-text-subtle focus:outline-none focus:border-icon-info-active"
            value={search()}
            onInput={(e) => setSearch(e.currentTarget.value)}
            autofocus
          />
          <button
            class="px-3 py-2 text-14-regular text-text-subtle hover:text-text-strong"
            onClick={() => refetch()}
          >
            <Icon name="arrow-path" size="small" />
          </button>
        </div>

        <Show
          when={!sessions.loading}
          fallback={<div class="text-14-regular text-text-weak text-center py-4">{language.t("common.loading")}</div>}
        >
          <Show
            when={sortedSessions().length > 0}
            fallback={
              <div class="text-14-regular text-text-weak text-center py-4">
                {language.t("command.sessions.empty")}
              </div>
            }
          >
            <div class="flex flex-col gap-1 max-h-80 overflow-auto">
              <For each={sortedSessions()}>
                {(session) => {
                  const current = createMemo(() => {
                    const parts = location.pathname.split("/")
                    const sessionId = parts[parts.length - 1]
                    return sessionId === session.id
                  })

                  return (
                    <button
                      class="w-full flex items-center justify-between gap-4 px-3 py-2 rounded-md text-left transition-colors"
                      classList={{
                        "bg-surface-raised-base-hover": current(),
                        "hover:bg-surface-raised-base-hover": !current(),
                      }}
                      onClick={() => handleSelect(session)}
                    >
                      <div class="flex flex-col min-w-0">
                        <span class="text-14-regular text-text-strong truncate">{session.title}</span>
                        <span class="text-12-regular text-text-subtle truncate">
                          {getRelativeTime(session.time.updated, language.t)}
                        </span>
                      </div>
                      <Show when={session.complete}>
                        <Icon name="check-circle" size="small" class="text-icon-positive shrink-0" />
                      </Show>
                    </button>
                  )
                }}
              </For>
            </div>
          </Show>
        </Show>
      </div>
    </Dialog>
  )
}
