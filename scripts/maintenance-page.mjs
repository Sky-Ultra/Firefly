// Temporary public response only. Restore the normal deployment only when the owner asks.
export const maintenanceHtml = `<!doctype html>
<html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>网站暂时下线 · Sky</title><style>
:root{color-scheme:light dark;font-family:system-ui,-apple-system,"Segoe UI",sans-serif}*{box-sizing:border-box}body{margin:0;min-height:100vh;min-height:100dvh;display:grid;place-items:center;padding:24px;background:#f7f1f4;color:#322a31}main{width:min(100%,480px);padding:48px 32px;text-align:center;border:1px solid #eadde4;border-radius:24px;background:#fff}.brand{color:#c56d90;font-size:14px;letter-spacing:.16em}h1{font-size:clamp(24px,5vw,32px);line-height:1.5;margin:20px 0 12px}p{line-height:1.8;color:#746a72;margin:0}.en{font-size:12px;margin-top:20px;color:#94848f}@media(prefers-color-scheme:dark){body{background:#18151a;color:#f4eaf0}main{background:#242027;border-color:#393039}p{color:#c1b4bd}.en{color:#9d8e99}}
</style></head><body><main><div class="brand">Sky</div><h1>网站暂时下线</h1><p>当前暂时无法访问，请稍后再来。</p><p class="en">Temporarily offline</p></main></body></html>`;

export function maintenanceResponse(request) {
	return new Response(request.method === "HEAD" ? null : maintenanceHtml, {
		status: 503,
		headers: {
			"Content-Type": "text/html; charset=utf-8",
			"Cache-Control": "no-store, max-age=0",
			"Cloudflare-CDN-Cache-Control": "no-store",
			"Retry-After": "3600",
			"X-Robots-Tag": "noindex, nofollow",
			"X-Content-Type-Options": "nosniff",
			"Content-Security-Policy":
				"default-src 'none'; style-src 'unsafe-inline'; base-uri 'none'; frame-ancestors 'none'; form-action 'none'",
		},
	});
}
