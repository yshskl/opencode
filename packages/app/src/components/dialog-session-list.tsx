import { useDialog } from "@opencode-ai/ui/context/dialog"
import { Dialog } from "@opencode-ai/ui/dialog"
import { Icon } from "@opencode-ai/ui/icon"
import { useNavigate } from "@solidjs/router"
import { createMemo, For, Show, createSignal } from "solid-js"
import { base64Encode } from "@opencode-ai/util/encode"
import { useSDK } from "@/context/sdk"
import { useLanguage } from "@/context/language"
import { getRelativeTime } from "@/utils/time"
import { DialogSelectDirectory } from "@/components/dialog-select-directory"
import { showToast } from "@opencode-ai/ui/toast"

type SessionInfo = {
  id: string
  directory: string
  title: string
  time: { updated: number }
  complete?: boolean
}

async function migrateSession(sessionID: string, newDirectory: string, baseUrl: string): Promise<void> {
  const response = await fetch(`${baseUrl}/session/${sessionID}/migrate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ directory: newDirectory }),
  })
  if (!response.ok) {
    throw new Error(`Failed to migrate session: ${response.statusText}`)
  }
}

export function DialogSessionList() {
  const dialog = useDialog()
  const navigate = useNavigate()
  const sdk = useSDK()
  const language = useLanguage()

  const [search, setSearch] = createSignal("")
  const [migratingSession, setMigratingSession] = createSignal<SessionInfo | null>(null)

  const [sessions, setSessions] = createSignal<SessionInfo[]>([])
  const [loading, setLoading] = createSignal(true)

  const loadSessions = async () => {
    setLoading(true)
    try {
      const result = await sdk.client.session.list({
        search: search() || undefined,
        limit: 50,
      })
      setSessions(result.data ?? [])
    } finally {
      setLoading(false)
    }
  }

  loadSessions()

  const sortedSessions = createMemo(() => {
    const list = sessions()
    return list
      .filter((x) => !x.parentID)
      .sort((a, b) => b.time.updated - a.time.updated)
  })

  const handleSelect = (session: SessionInfo) => {
    navigate(`/${base64Encode(session.directory)}/session/${session.id}`)
    dialog.clear()
  }

  const handleMigrate = async (newDirectory: string) => {
    const session = migratingSession()
    if (!session) return

    try {
      await migrateSession(session.id, newDirectory, sdk.url)
      showToast({
        title: language.t("command.sessions.migrate.success"),
      })
      setMigratingSession(null)
      loadSessions()
      dialog.replace(() => <DialogSessionList />)
    } catch (error) {
      showToast({
        title: language.t("command.sessions.migrate.error"),
        description: error instanceof Error ? error.message : String(error),
        variant: "error",
      })
    }
  }

  return (
    <>
      <Show when={migratingSession()}>
        <DialogSelectDirectory
          title={language.t("command.sessions.migrate.title")}
          onSelect={(result) => {
            if (result) {
              const dir = Array.isArray(result) ? result[0] : result
              handleMigrate(dir)
            } else {
              setMigratingSession(null)
            }
          }}
        />
      </Show>
      <Dialog title={language.t("command.sessions.title")} onClose={() => dialog.clear()}>
        <div class="flex flex-col gap-2 p-4">
          <div class="flex items-center gap-2">
            <input
              type="text"
              placeholder={language.t("command.sessions.search")}
              class="flex-1 px-3 py-2 bg-surface-base border border-xs-border-base rounded-md text-14-regular text-text-strong placeholder:text-text-subtle focus:outline-none focus:border-icon-info-active"
              value={search()}
              onInput={(e) => {
                setSearch(e.currentTarget.value)
                loadSessions()
              }}
              autofocus
            />
            <button
              class="px-3 py-2 text-14-regular text-text-subtle hover:text-text-strong"
              onClick={() => loadSessions()}
            >
              <Icon name="arrow-path" size="small" />
            </button>
          </div>

          <Show
            when={!loading()}
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
                      <div class="group relative">
                        <button
                          class="w-full flex items-center justify-between gap-4 px-3 py-2 rounded-md text-left transition-colors"
                          classList={{
                            "bg-surface-raised-base-hover": current(),
                            "hover:bg-surface-raised-base-hover": !current(),
                          }}
                          onClick={() => handleSelect(session)}
                        >
                          <div class="flex flex-col min-w-0 flex-1">
                            <span class="text-14-regular text-text-strong truncate">{session.title}</span>
                            <span class="text-12-regular text-text-subtle truncate">{session.directory}</span>
                            <span class="text-12-regular text-text-subtle">
                              {getRelativeTime(session.time.updated, language.t)}
                            </span>
                          </div>
                          <div class="flex items-center gap-2 shrink-0">
                            <Show when={session.complete}>
                              <Icon name="check-circle" size="small" class="text-icon-positive" />
                            </Show>
                          </div>
                        </button>
                        <button
                          class="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 text-12-regular text-text-subtle hover:text-text-strong opacity-0 group-hover:opacity-100 transition-opacity bg-surface-raised-base-hover rounded"
                          onClick={(e) => {
                            e.stopPropagation()
                            setMigratingSession(session)
                          }}
                          title={language.t("command.sessions.migrate.button")}
                        >
                          <Icon name="arrow-right-circle" size="small" />
                        </button>
                      </div>
                    )
                  }}
                </For>
              </div>
            </Show>
          </Show>
        </div>
      </Dialog>
    </>
  )
}
