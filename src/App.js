import { Route, Switch } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import Doctors from "./containers/Doctors/Doctors";
import Medicines from "./containers/Medicines/Medicines";

function App() {
  return (
    <>
      <Layout>
        <Switch>
          <Route exact path={"/medicines"} component={Medicines} />
          <Route exact path={"/doctors"} component={Doctors} />
        </Switch>
      </Layout>
    </>
  );
}

export default App;
