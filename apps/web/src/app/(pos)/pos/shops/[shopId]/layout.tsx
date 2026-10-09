import { PosSidebar } from '@/components/layout/pos-sidebar'
import { SectionGate } from '@/components/layout/section-gate'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'

/**
 * Shop scope (spec 09 §2.8, spec 10 S-01): the role's sidebar and the section, or `ForbiddenState`
 * when the section belongs to another role (X-03).
 * TODO(ShopScope): resolve the caller's membership for `shopId` from `GET /api/v1/me`; render
 * `NotFoundState` when there is none (same as the API's 404, D20) and store `bf:lastShopId`.
 */
export default async function ShopLayout({ children, params }: LayoutProps<'/pos/shops/[shopId]'>) {
  const { shopId } = await params

  return (
    <SidebarProvider className="min-h-[calc(100svh-3rem)]">
      <PosSidebar shopId={shopId} />
      <SidebarInset id="main" tabIndex={-1} className="bg-canvas outline-none">
        <div className="flex h-12 items-center border-b border-border-subtle bg-layer px-4 md:hidden">
          <SidebarTrigger aria-label="Open shop navigation" />
        </div>
        <div className="mx-auto w-full max-w-screen-2xl px-4 py-6 sm:px-8 sm:py-8">
          <SectionGate shopId={shopId}>{children}</SectionGate>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
