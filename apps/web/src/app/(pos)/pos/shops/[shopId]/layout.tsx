import { PosSidebar } from '@/components/layout/pos-sidebar'
import { SectionGate } from '@/components/layout/section-gate'
import { SidebarInset } from '@/components/ui/sidebar'

/**
 * Shop scope (spec 09 §2.8, spec 10 S-01): the role's sidebar and the section, or `ForbiddenState`
 * when the section belongs to another role (X-03). The sidebar state and its toggle live in the
 * POS layout and header. Content: max-w-7xl on the canvas, 24/32px gutters (DESIGN.md).
 * TODO(ShopScope): resolve the caller's membership for `shopId` from `GET /api/v1/me`; render
 * `NotFoundState` when there is none (same as the API's 404, D20) and store `bf:lastShopId`.
 */
export default async function ShopLayout({ children, params }: LayoutProps<'/pos/shops/[shopId]'>) {
  const { shopId } = await params

  return (
    <div className="flex flex-1">
      <PosSidebar shopId={shopId} />
      <SidebarInset
        id="main"
        tabIndex={-1}
        className="min-w-0 overflow-x-clip bg-canvas outline-none"
      >
        <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <SectionGate shopId={shopId}>{children}</SectionGate>
        </div>
      </SidebarInset>
    </div>
  )
}
