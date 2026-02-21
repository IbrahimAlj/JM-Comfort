# Admin Dashboard Layout Design

JMHABIBI-164

## Overview

This document describes the layout design for the JM Comfort admin dashboard.
The design defines a sidebar navigation pattern with a main content area that
supports cards, tables, and forms across all admin pages.

## Wireframe

```
+----------------------------------------------------------+
|                                                          |
| +----------+ +----------------------------------------+ |
| | SIDEBAR  | | TOP BAR                    user@email  | |
| |          | +----------------------------------------+ |
| | JM       | |                                        | |
| | Comfort  | |  MAIN CONTENT AREA                     | |
| | Admin    | |                                        | |
| | Panel    | |  +--------+ +--------+ +--------+     | |
| |          | |  | Card   | | Card   | | Card   |     | |
| | -------- | |  | Leads  | | Srvcs  | | Proj   |     | |
| | Dashboard| |  +--------+ +--------+ +--------+     | |
| | Leads    | |                                        | |
| | Projects | |  +--------+ +--------+                | |
| | Apptmts  | |  | Card   | | Card   |                | |
| | Services | |  | Review | | Upload |                | |
| | Reviews  | |  +--------+ +--------+                | |
| | Upload   | |                                        | |
| |          | |  (or table / form content depending    | |
| |          | |   on the active page)                  | |
| |          | |                                        | |
| | -------- | |                                        | |
| | Logout   | |                                        | |
| +----------+ +----------------------------------------+ |
|                                                          |
+----------------------------------------------------------+
```

## Component Breakdown

### AdminLayout
- Root container: `position: fixed; inset: 0; display: flex`
- Background: `#F9FAFB` (gray-50)
- Contains AdminSidebar and the main area (top bar + content)

### AdminSidebar
- Width: `220px` fixed on desktop
- Background: `#000000` (black)
- Text color: white
- Sections:
  - **Header**: "JM Comfort" brand with "Admin Panel" subtitle
    - Padding: `20px 24px`
    - Bottom border: `1px solid #1F2937`
  - **Navigation**: Scrollable list of NavLink items
    - Padding: `16px 12px`
    - Each item: `padding 9px 12px`, `border-radius 6px`, `font-size 14px`
  - **Logout**: Button pinned to bottom
    - Top border: `1px solid #1F2937`
    - Padding: `16px 12px`

### Top Bar (Header)
- Height: `56px` fixed
- Background: white
- Bottom border: `1px solid #E5E7EB`
- Content: User email aligned right
- Padding: `0 24px`

### Main Content Area
- Flex: `1` (fills remaining horizontal space)
- Overflow: `auto` vertical scroll
- Padding: `32px`
- Renders child page via React Router `<Outlet />`

### Dashboard Page (Home)
- Title: "Dashboard" (`22px`, semibold)
- Subtitle: "Signed in as {email}" (`13px`, gray)
- Cards: Flex wrap row with `16px` gap
  - Each card: white background, `1px solid #E5E7EB` border, `8px` radius, `24px` padding
  - Min width: `160px`
  - Hover: border color changes to `#9CA3AF`
  - Label: "Manage" uppercase (`12px`, gray)
  - Title: Section name (`18px`, semibold)

## Sidebar Navigation Items

| Label          | Route                 | Content Type     |
|----------------|-----------------------|------------------|
| Dashboard      | /admin/dashboard      | Cards overview   |
| Leads          | /admin/leads          | Table            |
| Projects       | /admin/projects       | Table + Form     |
| Appointments   | /admin/appointments   | Table            |
| Services       | /admin/services       | Table + Form     |
| Reviews        | /admin/reviews        | Table            |
| Upload Pictures| /admin/upload         | Form             |

## Active Link State

- **Active**: `color: white`, `background-color: #1F2937` (gray-800)
- **Inactive**: `color: #9CA3AF` (gray-400), `background-color: transparent`
- **Transition**: `background-color 0.15s, color 0.15s`
- Uses React Router `NavLink` with `isActive` style callback

## Typography

| Element             | Size   | Weight  | Color    |
|---------------------|--------|---------|----------|
| Page title          | 22px   | 600     | #1F2937  |
| Page subtitle       | 13px   | normal  | #6B7280  |
| Sidebar brand       | 16px   | 600     | white    |
| Sidebar subtitle    | 11px   | normal  | #6B7280  |
| Nav item            | 14px   | 500     | varies   |
| Card label          | 12px   | 500     | #6B7280  |
| Card title          | 18px   | 600     | #1F2937  |
| Top bar email       | 13px   | normal  | #6B7280  |

## Color Palette

| Usage              | Color     | Hex      |
|--------------------|-----------|----------|
| Sidebar background | Black     | #000000  |
| Sidebar border     | Gray-800  | #1F2937  |
| Page background    | Gray-50   | #F9FAFB  |
| Card background    | White     | #FFFFFF  |
| Card border        | Gray-200  | #E5E7EB  |
| Card border hover  | Gray-400  | #9CA3AF  |
| Primary text       | Gray-800  | #1F2937  |
| Secondary text     | Gray-500  | #6B7280  |
| Muted text         | Gray-400  | #9CA3AF  |
| Top bar background | White     | #FFFFFF  |
| Top bar border     | Gray-200  | #E5E7EB  |

## Spacing

| Area                  | Value       |
|-----------------------|-------------|
| Sidebar width         | 220px       |
| Top bar height        | 56px        |
| Main content padding  | 32px        |
| Sidebar header padding| 20px 24px   |
| Sidebar nav padding   | 16px 12px   |
| Nav item padding      | 9px 12px    |
| Nav item gap          | 2px (margin-bottom) |
| Dashboard card padding| 24px        |
| Dashboard card gap    | 16px        |
| Card min-width        | 160px       |

## Responsive Behavior

### Desktop (default)
- Sidebar: Fixed at 220px, always visible
- Main content: Fills remaining width
- Layout: Side-by-side flexbox

### Tablet (below 768px - planned)
- Sidebar: Collapses to hidden by default
- Hamburger button appears in top bar to toggle sidebar
- Sidebar opens as overlay or drawer from the left
- Main content takes full width when sidebar is hidden
- Sidebar overlay has semi-transparent backdrop

### Mobile (below 640px - planned)
- Same as tablet behavior
- Dashboard cards stack vertically (flex-wrap handles this)
- Tables become horizontally scrollable (overflow-x-auto)
- Forms go full width (single column)

### Implementation Notes for Responsive
- Add a `sidebarOpen` state to AdminLayout
- Use `useState(false)` for default collapsed on mobile
- Use a media query or `window.innerWidth` check on mount
- Sidebar gets `position: fixed` on mobile with `z-index: 40`
- Add backdrop div with `onClick` to close sidebar
- Hamburger button: three horizontal lines, placed left side of top bar

## Content Area Patterns

### Cards (Dashboard)
- Flex row, wrap enabled, 16px gap
- Each card is a Link component
- Cards adapt to available width via min-width

### Tables (Leads, Projects, Appointments, Services, Reviews)
- Full width with `overflow-x-auto` wrapper
- Header row: gray-50 background, uppercase text
- Body rows: white background, divided by gray-200 borders
- Action buttons in last column

### Forms (Projects, Services, Upload)
- Gray-50 background panel with border
- Grid layout: 2 columns on desktop, 1 on mobile
- Labels with required field indicators
- Error messages in red below form
- Submit and cancel buttons

## Protected Route Pattern

- All admin routes except /admin/login are wrapped in `<Protected />`
- Protected component checks authentication via `getUser()`
- Unauthenticated users are redirected to /admin/login
- AdminLayout wraps all protected page routes
- Each page renders inside the `<Outlet />` of AdminLayout

## Mock Component

A visual mock component is provided at:
`client/src/admin/DashboardLayoutMock.jsx`

This component renders the layout wireframe with placeholder content.
It is not connected to real routes and is for design review only.
