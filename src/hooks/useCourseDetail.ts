import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export const useCourseDetail = (id: string) => {
  const navigate = useNavigate();
  const [corso, setCorso] = useState<any>(null);
  const [companies, setCompanies] = useState<any[]>([]);

  useEffect(() => {
    const loadCourseData = () => {
      const storedCourses = localStorage.getItem('courses');
      if (storedCourses) {
        const parsedCourses = JSON.parse(storedCourses);
        const foundCourse = parsedCourses.find(course => course.id === id);
        if (foundCourse) {
          return foundCourse;
        }
      }
      
      const defaultCourses = [
        {
          id: "1",
          codice: "FORM-001",
          titolo: "Sicurezza sul Lavoro",
          dataInizio: "2023-10-15",
          dataFine: "2023-11-15",
          sede: "Via Roma 123, Milano",
          moduloFormativo: "Sicurezza generale",
          giornateDiLezione: [
            { id: "g1", data: "2023-10-15", orario: "09:00 - 13:00", sede: "Aula Magna" },
            { id: "g2", data: "2023-10-22", orario: "09:00 - 13:00", sede: "Aula Magna" },
            { id: "g3", data: "2023-11-05", orario: "09:00 - 13:00", sede: "Laboratorio A" },
            { id: "g4", data: "2023-11-15", orario: "09:00 - 13:00", sede: "Aula Magna" }
          ],
          partecipantiList: [
            { id: "p1", nome: "Mario", cognome: "Rossi", azienda: "TechSolutions Srl", ruolo: "Tecnico" },
            { id: "p2", nome: "Giulia", cognome: "Verdi", azienda: "TechSolutions Srl", ruolo: "Manager" },
            { id: "p3", nome: "Paolo", cognome: "Bianchi", azienda: "InnovaSpa", ruolo: "Operaio" },
            { id: "p4", nome: "Laura", cognome: "Neri", azienda: "InnovaSpa", ruolo: "Responsabile" }
          ],
          partecipanti: 4,
          docentiList: [
            { id: "d1", nome: "Prof. Alberto", cognome: "Mariani", specializzazione: "Sicurezza sul lavoro" }
          ],
          docenti: 1,
          tutorList: [
            { id: "t1", nome: "Dott.ssa Carla", cognome: "Esposito", ruolo: "Tutor d'aula" }
          ],
          tutor: 1,
          edizioni: 3,
          aziende: 5,
          stato: "Completato"
        },
        {
          id: "2",
          codice: "FORM-002",
          titolo: "Marketing Digitale",
          dataInizio: "2023-12-01",
          dataFine: "2023-12-20",
          sede: "Via Milano 45, Roma",
          moduloFormativo: "Marketing base",
          giornateDiLezione: [],
          partecipantiList: [],
          partecipanti: 0,
          docentiList: [],
          docenti: 0,
          tutorList: [],
          tutor: 0,
          edizioni: 1,
          aziende: 3,
          stato: "In corso"
        }
      ];
      
      return defaultCourses.find(course => course.id === id);
    };
    
    const foundCourse = loadCourseData();
    if (foundCourse) {
      setCorso(foundCourse);
    } else {
      toast.error("Corso non trovato");
      navigate("/corsi");
    }
    
    const storedCompanies = localStorage.getItem('companies');
    if (storedCompanies) {
      setCompanies(JSON.parse(storedCompanies));
    }
  }, [id, navigate]);

  return { corso, setCorso, companies };
};
