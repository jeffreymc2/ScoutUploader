// // components/Uploader.tsx
// 'use client';

// import React, { useState } from 'react';
// import { supabaseBrowser } from '@/lib/supabase/browser';
// import { Database } from '@/lib/types/supabase';
// import { useQueryClient } from '@tanstack/react-query';
// import { toast } from 'sonner';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { v4 as uuidv4 } from 'uuid';

// interface UploaderProps {
//   playerid: number;
//   FullName: string;
//   eventId?: string;
// }

// const Uploader: React.FC<UploaderProps> = ({ playerid, FullName, eventId }) => {
//   const supabase = supabaseBrowser();
//   const queryClient = useQueryClient();
//   const [isUploading, setIsUploading] = useState(false);
//   const [selectedEvent, setSelectedEvent] = useState(eventId || '');
//   const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);

//   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setSelectedFiles(event.target.files);
//   };

//   const handleUpload = async () => {
//     if (!selectedFiles || selectedFiles.length === 0) {
//       toast.error('Please select files to upload.');
//       return;
//     }

//     if (!selectedEvent) {
//       toast.error('Please select an event.');
//       return;
//     }

//     setIsUploading(true);

//     const eventFolderPath = `/event/${selectedEvent}`;

//     for (let i = 0; i < selectedFiles.length; i++) {
//       const file = selectedFiles[i];
//       const fileName = `${uuidv4()}_${file.name}`;
//       const filePath = `${eventFolderPath}/${fileName}`;

//       const { error } = await supabase.storage
//         .from('images')
//         .upload(filePath, file);

//       if (error) {
//         toast.error(`Error uploading file: ${file.name}`);
//         console.error('Error uploading file:', error);
//       } else {
//         toast.success(`File uploaded successfully: ${file.name}`);
//         queryClient.invalidateQueries(['posts']);
//       }
//     }

//     setIsUploading(false);
//     setSelectedFiles(null);
//   };

//   return (
//     <div className="space-y-4">
//       <div>
//         <Label htmlFor="eventId">Event ID</Label>
//         <Input
//           id="eventId"
//           value={selectedEvent}
//           onChange={(e) => setSelectedEvent(e.target.value)}
//           placeholder="Enter event ID"
//         />
//       </div>
//       <div>
//         <Label htmlFor="files">Select Files</Label>
//         <Input
//           id="files"
//           type="file"
//           multiple
//           onChange={handleFileChange}
//         />
//       </div>
//       <Button onClick={handleUpload} disabled={isUploading}>
//         {isUploading ? 'Uploading...' : 'Upload'}
//       </Button>
//     </div>
//   );
// };

// export default Uploader;