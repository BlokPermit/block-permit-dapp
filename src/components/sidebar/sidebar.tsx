import Navigation from "@/components/navigation/navigation";

export default function Sidebar() {
  return (

      <div style={{width: 350}} className="flex h-screen flex-col justify-between border-e bg-white">
        <div className="px-4 py-6">
    <span
        className="grid h-10 w-32 place-content-center rounded-lg bg-gray-100 text-xs text-gray-600"
    >
      Logo
    </span>

        <Navigation />
        </div>

        <div className="sticky inset-x-0 bottom-0 border-t border-gray-100">
          <a href="@/app/components/page#" className="flex items-center gap-2 bg-white p-4 hover:bg-gray-50">
            <img
                alt="Man"
                src="https://images.unsplash.com/photo-1600486913747-55e5470d6f40?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
                className="h-10 w-10 rounded-full object-cover"
            />

            <div>
              <p className="text-xs">
                <strong className="block font-medium">Eric Frusciante</strong>

                <span> eric@frusciante.com </span>
              </p>
            </div>
          </a>
        </div>
      </div>
  )
}
