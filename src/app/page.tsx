export default function Home() {
  async function handleTest() {
    "use server";

    console.log("test");

    return "test";
  }

  return (
    <main className="w-full h-svh grid place-items-center">
      <h1>Cleaned up</h1>

      <form action={handleTest}>
        <button className="btn btn-primary" type="submit">
          Button
        </button>
      </form>
    </main>
  );
}
