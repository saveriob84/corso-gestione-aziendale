
import React, { useState } from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import CourseFormDialog from "@/components/dialogs/CourseFormDialog";
import { useCourses } from "@/hooks/useCourses";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { StatsCards } from "@/components/dashboard/StatsCards";
import CourseTable from "@/components/dashboard/CourseTable";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddingCourse, setIsAddingCourse] = useState(false);
  const [editingCourse, setEditingCourse] = useState<any>(null);
  const [deletingCourse, setDeletingCourse] = useState<any>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  
  const { courses, loadCourses, deleteCourse } = useCourses();

  const handleDeleteCourse = async () => {
    if (deletingCourse) {
      const success = await deleteCourse(deletingCourse.id, deleteConfirmation);
      if (success) {
        setDeletingCourse(null);
        setDeleteConfirmation('');
      }
    }
  };

  const filteredCorsi = courses.filter(corso =>
    corso.codice?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    corso.titolo?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <DashboardHeader onAddCourse={() => setIsAddingCourse(true)} />
      <StatsCards />
      <CourseTable 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filteredCorsi={filteredCorsi}
        onEditCourse={setEditingCourse}
        onDeleteCourse={setDeletingCourse}
      />

      <CourseFormDialog 
        isOpen={isAddingCourse}
        onClose={() => setIsAddingCourse(false)}
        onCourseAdded={loadCourses}
      />

      {editingCourse && (
        <CourseFormDialog
          isOpen={Boolean(editingCourse)}
          onClose={() => setEditingCourse(null)}
          initialData={editingCourse}
          isEditing
          onCourseAdded={loadCourses}
        />
      )}

      <AlertDialog open={!!deletingCourse} onOpenChange={() => setDeletingCourse(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Conferma eliminazione corso</AlertDialogTitle>
            <AlertDialogDescription>
              Questa azione non può essere annullata. Per confermare l'eliminazione, 
              digita il nome del corso: <strong>{deletingCourse?.titolo}</strong>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="my-4">
            <Input
              value={deleteConfirmation}
              onChange={(e) => setDeleteConfirmation(e.target.value)}
              placeholder="Digita il nome del corso per confermare"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setDeletingCourse(null);
              setDeleteConfirmation('');
            }}>
              Annulla
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteCourse}
              className="bg-red-500 hover:bg-red-600"
            >
              Elimina
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Index;
