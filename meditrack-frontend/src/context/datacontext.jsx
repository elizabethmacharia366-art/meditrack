import React, { createContext, useState, useEffect } from "react";
import api from "../services/api";

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [hospitals, setHospitals] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const apptRes = await api.get("/appointments");
      const presRes = await api.get("/prescriptions");
      const hospRes = await api.get("/hospitals");
      setAppointments(apptRes.data);
      setPrescriptions(presRes.data);
      setHospitals(hospRes.data);
    };
    fetchData();
  }, []);

  return (
    <DataContext.Provider value={{ appointments, prescriptions, hospitals }}>
      {children}
    </DataContext.Provider>
  );
};
