import { PosSidebar } from '@/components/layout/pos-sidebar'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'

/**
 * Shop scope (spec 09 §2.8, spec 10 S-01): sidebar + content for one shop.
 * TODO(ShopScope): resolve the caller's membership for `shopId` from `GET /api/v1/me`; render
 * `NotFoundState` when there is none (same as the API's 404, D20) and store `bf:lastShopId`.
 */
export default async function ShopLayout({ children, params }: LayoutProps<'/pos/shops/[shopId]'>) {
  const { shopId } = await params

  return (
    <SidebarProvider className="min-h-[calc(100svh-3.5rem)]">
      <PosSidebar shopId={shopId} />
      <SidebarInset id="main" tabIndex={-1} className="bg-muted outline-none">
        <div className="flex h-12 items-center border-b bg-background px-4 md:hidden">
          <SidebarTrigger aria-label="Open shop navigation" />
        </div>
        <div className="mx-auto w-full max-w-screen-2xl p-4 sm:p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
