
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CourseInfo from './CourseInfo';
import LessonList from './LessonList';
import ParticipantList from './ParticipantList';
import TeacherTutorList from './TeacherTutorList';

interface CourseDetailTabsProps {
  corso: any;
  onAddLesson: () => void;
  onEditLesson: (lesson: any) => void;
  onDeleteLesson: (lessonId: string) => void;
  onEditParticipant: (participantId: string) => void;
  onDeleteParticipant: (participantId: string) => void;
  onDownloadTemplate: () => void;
  onImportExcel: () => void;
  onLoadExistingParticipant: () => void;
  onAddTeacher: () => void;
  onAddTutor: () => void;
  onAddParticipant: () => void;
  getCompanyName: (companyId: string) => string;
  courseId: string;
}

const CourseDetailTabs = ({
  corso,
  onAddLesson,
  onEditLesson,
  onDeleteLesson,
  onEditParticipant,
  onDeleteParticipant,
  onDownloadTemplate,
  onImportExcel,
  onLoadExistingParticipant,
  onAddTeacher,
  onAddTutor,
  onAddParticipant,
  getCompanyName,
  courseId
}: CourseDetailTabsProps) => {
  return (
    <Tabs defaultValue="anagrafica" className="w-full">
      <TabsList className="grid grid-cols-4 md:w-[600px]">
        <TabsTrigger value="anagrafica">Anagrafica</TabsTrigger>
        <TabsTrigger value="calendario">Calendario</TabsTrigger>
        <TabsTrigger value="partecipanti">Partecipanti</TabsTrigger>
        <TabsTrigger value="docenti">Docenti e Tutor</TabsTrigger>
      </TabsList>

      <TabsContent value="anagrafica" className="space-y-4 mt-4">
        <CourseInfo corso={corso} />
      </TabsContent>

      <TabsContent value="calendario" className="mt-4">
        <LessonList 
          giornateDiLezione={corso.giornateDiLezione} 
          onAddLesson={onAddLesson}
          onEditLesson={onEditLesson}
          onDeleteLesson={onDeleteLesson}
        />
      </TabsContent>

      <TabsContent value="partecipanti" className="mt-4">
        <ParticipantList 
          partecipantiList={corso.partecipantiList}
          onEditParticipant={onEditParticipant}
          onDeleteParticipant={onDeleteParticipant}
          onDownloadTemplate={onDownloadTemplate}
          onImportExcel={onImportExcel}
          onLoadExistingParticipant={onLoadExistingParticipant}
          onAddParticipant={onAddParticipant}
          getCompanyName={getCompanyName}
          courseId={courseId}
        />
      </TabsContent>

      <TabsContent value="docenti" className="mt-4 space-y-6">
        <TeacherTutorList
          title="Docenti"
          description="Professori e specialisti"
          list={corso.docentiList}
          onAdd={onAddTeacher}
          type="docenti"
        />

        <TeacherTutorList
          title="Tutor"
          description="Assistenti e supporto"
          list={corso.tutorList}
          onAdd={onAddTutor}
          type="tutor"
        />
      </TabsContent>
    </Tabs>
  );
};

export default CourseDetailTabs;
