import MainLayout from "../components/layouts/MainLayout";
import JournalGrid from "../components/journal/JournalGrid";
import { Button } from "../components/ui/button";

const JournalPage = () => {
  return (
    <MainLayout>
      <div className="container py-6 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Travel Journal</h1>
            <p className="text-muted-foreground">
              Document and share your travel experiences
            </p>
          </div>
          <Button>Create New Entry</Button>
        </div>

        <JournalGrid />
      </div>
    </MainLayout>
  );
};

export default JournalPage;
