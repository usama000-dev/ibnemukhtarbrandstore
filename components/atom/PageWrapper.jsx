
const PageWrapper = ({children}) => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between py-8 px-2" >
      {children}
    </main>
  )
}

export default PageWrapper
