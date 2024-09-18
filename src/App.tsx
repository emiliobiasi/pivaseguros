import { Carda } from "./components/Carda/Carda";
import { Button } from "./components/ui/button";

function App() {
  return (
    <>
      <h1 className="text-3xl font-bold underline">Hello world!</h1>
      <Button variant="destructive">Click me!</Button>
      <Carda />
    </>
  );
}

export default App;
