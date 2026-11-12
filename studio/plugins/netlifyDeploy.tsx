import {useState} from 'react'
import {definePlugin} from 'sanity'
import {LaunchIcon, RocketIcon} from '@sanity/icons'
import {Box, Button, Card, Stack, Text, Flex} from '@sanity/ui'

const REVALIDATE_SECRET = process.env.SANITY_STUDIO_REVALIDATE_SECRET
const PRODUCTION_SITE_URL =
  process.env.SANITY_STUDIO_PRODUCTION_SITE_URL || 'https://solander38.com'
const PREVIEW_SITE_URL =
  process.env.SANITY_STUDIO_PREVIEW_SITE_URL || 'https://solander38-preview.netlify.app'

// Requested right after a publish so the first visitor doesn't wait on the
// re-render. Only landing pages: warming every story/drawing would be hundreds
// of requests.
const WARM_PATHS = ['/', '/stories', '/anatomy', '/people', '/photography', '/drawings']
// gives Netlify time to purge its cache before the warm-up requests arrive
const WARM_DELAY_MS = 2000

function warmPages() {
  setTimeout(() => {
    WARM_PATHS.forEach((path) => {
      fetch(`${PRODUCTION_SITE_URL}${path}`, {mode: 'no-cors'}).catch(() => {})
    })
  }, WARM_DELAY_MS)
}

type Status = 'idle' | 'publishing' | 'success' | 'error'

const LABELS: Record<Status, string> = {
  idle: 'Publish content',
  publishing: 'Publishing…',
  success: 'Content published',
  error: 'Publish failed',
}

function DeployTool() {
  const [status, setStatus] = useState<Status>('idle')

  async function handlePublish() {
    setStatus('publishing')
    try {
      const res = await fetch(`${PRODUCTION_SITE_URL}/api/revalidate`, {
        method: 'POST',
        headers: {Authorization: `Bearer ${REVALIDATE_SECRET}`},
      })
      setStatus(res.ok ? 'success' : 'error')
      if (res.ok) warmPages()
    } catch {
      setStatus('error')
    }
  }

  return (
    <Box padding={4} style={{maxWidth: 700, margin: '0 auto'}}>
      <Card padding={4} radius={2} shadow={1}>
        <Stack padding={4} space={4}>
          <Stack space={3}>
            <Text size={2} weight="semibold">
              Publish content to production
            </Text>
            <Text size={1} muted>
              Refreshes every page on the production site with the latest{' '}
              <strong>published</strong> content. Takes effect within seconds.
            </Text>
          </Stack>
          <Flex gap={4} align="center">
            <Button
              as="a"
              href={PREVIEW_SITE_URL}
              target="_blank"
              rel="noopener noreferrer"
              icon={LaunchIcon}
              text="Open preview site"
              mode="ghost"
            />
            <Button
              icon={RocketIcon}
              text={LABELS[status]}
              tone={status === 'error' ? 'critical' : status === 'success' ? 'positive' : 'primary'}
              disabled={status === 'publishing' || !REVALIDATE_SECRET}
              onClick={handlePublish}
            />
            {!REVALIDATE_SECRET && (
              <Text size={1} muted>
                SANITY_STUDIO_REVALIDATE_SECRET is not set.
              </Text>
            )}
          </Flex>
        </Stack>
      </Card>
    </Box>
  )
}

export const netlifyDeploy = definePlugin(() => ({
  name: 'netlify-deploy',
  tools: [
    {
      name: 'deploy',
      title: 'Deploy',
      icon: RocketIcon,
      component: DeployTool,
    },
  ],
}))
