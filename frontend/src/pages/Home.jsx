import Header from "../components/Header";
import DiabetesForm from "../components/DiabetesForm";
import Footer from "../components/Footer";

function Home() {

  return (

    <div className="app">

      <Header />

      <main className="main-content">

        <div className="container">

          <div className="card">

            <div className="card-top">

              <div className="card-badge">
                AI Health Assessment
              </div>

              <h1 className="title">
                Diabetes Risk Prediction
              </h1>

              <p className="subtitle">
                กรอกข้อมูลสุขภาพเพื่อประเมินความเสี่ยงโรคเบาหวาน
              </p>

            </div>

            <DiabetesForm />

          </div>

        </div>

      </main>

      <Footer />

    </div>

  );

}

export default Home;