export function TodosLayout({ children }: React.PropsWithChildren) {
  return (
    <main>
      <h1 className="sr-only">Todos – simple task manager</h1>
      <section className="py-16">
        <div className="mx-auto w-full min-w-[375px] px-4 lg:max-w-[1024px]">
          <h2 className="sr-only">Here are your current todos</h2>
          {children}
        </div>
      </section>
    </main>
  );
}
