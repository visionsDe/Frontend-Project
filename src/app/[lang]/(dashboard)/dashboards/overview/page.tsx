import { Card, CardContent, CardHeader, Grid, Typography } from '@mui/material'

const MODULES = [
  { title: 'Payments', path: 'apps/payments', summary: 'Held funds + per-currency rollup for the SCT flow.' },
  { title: 'Webhooks', path: 'apps/webhooks', summary: 'Apple + Google subscription webhook audit log and Apple offer-code generator.' },
  { title: 'Chat', path: 'apps/chat', summary: 'Socket.IO powered support chat with file upload.' },
  { title: 'AI usage', path: 'apps/ai-usage', summary: 'Per-feature AI spend / latency / error-rate dashboard.' },
]

export default function OverviewPage() {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h4" gutterBottom>
          Sample Marketplace Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Five modules sampled from a production Next.js + MUI + Redux Toolkit admin dashboard.
        </Typography>
      </Grid>
      {MODULES.map(m => (
        <Grid key={m.path} item xs={12} sm={6} md={3}>
          <Card>
            <CardHeader title={m.title} />
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                {m.summary}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  )
}
