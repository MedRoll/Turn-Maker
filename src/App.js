
import { useState, useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function App() {
  const [date, setDate] = useState("2025-06-27");
  const [shifts, setShifts] = useState({
    "EX ART.26": {
      Infermieri: { mattina: "", pomeriggio: "", notte: "" },
      OSS: { mattina: "", pomeriggio: "", notte: "" }
    },
    "COD. 56 LATO C": {
      Infermieri: { mattina: "", pomeriggio: "", notte: "" },
      OSS: { mattina: "", pomeriggio: "", notte: "" }
    },
    "COD. 56 LATO A": {
      Infermieri: { mattina: "", pomeriggio: "", notte: "" },
      OSS: { mattina: "", pomeriggio: "", notte: "" }
    },
    SUAP: {
      Infermieri: { mattina: "", pomeriggio: "", notte: "" },
      OSS: { mattina: "", pomeriggio: "", notte: "" }
    }
  });

  const shiftRef = useRef(null);

  const updateShift = (reparto, ruolo, fascia, value) => {
    setShifts(prev => ({
      ...prev,
      [reparto]: {
        ...prev[reparto],
        [ruolo]: {
          ...prev[reparto][ruolo],
          [fascia]: value
        }
      }
    }));
  };

  const exportToPDF = () => {
    if (!shiftRef.current) return;
    html2canvas(shiftRef.current).then(canvas => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`turno_${date}.pdf`);
    });
  };

  const exportToPNG = () => {
    if (!shiftRef.current) return;
    html2canvas(shiftRef.current).then(canvas => {
      const link = document.createElement("a");
      link.download = `turno_${date}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    });
  };

  return (
    <div className="p-6 max-w-screen-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Turno del {date}</h1>
      <input
        type="date"
        className="mb-6 p-2 border rounded"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      <div className="mb-6 flex gap-4">
        <button
          onClick={exportToPDF}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Esporta in PDF
        </button>
        <button
          onClick={exportToPNG}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Esporta in PNG
        </button>
      </div>

      <div className="grid gap-6" ref={shiftRef}>
        {Object.entries(shifts).map(([reparto, ruoli]) => (
          <div key={reparto} className="border p-4 rounded shadow">
            <h2 className="text-xl font-semibold mb-2">{reparto}</h2>
            {Object.entries(ruoli).map(([ruolo, orari]) => (
              <div key={ruolo} className="ml-4 mb-4">
                <h3 className="font-medium mb-1">{ruolo}</h3>
                <div className="grid grid-cols-3 gap-2">
                  {Object.entries(orari).map(([fascia, nome]) => (
                    <input
                      key={fascia}
                      placeholder={fascia}
                      className="border p-2 rounded"
                      value={nome}
                      onChange={(e) => updateShift(reparto, ruolo, fascia, e.target.value)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
