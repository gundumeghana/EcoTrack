import { RouterProvider } from 'react-router';
import { router } from './routes';
import { useEffect } from "react";
import { seedAllData } from "../firebase";

export default function App() {

  useEffect(() => {
    seedAllData();
  }, []);

  return <RouterProvider router={router} />;
}