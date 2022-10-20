import AppLayout from "@lib/components/Layouts/AppLayout";
import { useSession } from "next-auth/react";
import { getSession } from "@lib/auth/session";
import Files from "react-butterfiles";
import { useState } from "react";
import { FolderIcon } from "@heroicons/react/outline";

const Page = () => {
  const [files, setFiles] = useState([])
  const [errors, setErrors] = useState([])
  const { status, data: session } = useSession({
    required: false,
  });

  const handleSuccess = (files) => {
    setErrors([])
    setFiles(files)
    return console.log("Upload successful")
  }

  const handleErrors = (errors) => {
    setFiles([])
    setErrors(errors)
    return console.log("Upload Error")
  }


  console.log(files)
  return (
    <>
      <AppLayout>
        <div className="flex justify-center w-full">
        <Files
          multiple={false} maxSize="2mb" multipleMaxSize="10mb" accept={["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"]}
          onSuccess={files => handleSuccess(files)}
          onError={errors => handleErrors(errors)}
      >
          {({ browseFiles, getDropZoneProps }) => {
              return (
                  <div>
                      <label>Drag and drop .xlsx file</label>
                      {errors.length > 0 && <p style={{color: "red"}}>Unsupported File type</p>}
                      <div
                          {...getDropZoneProps({
                              style: {
                                  
                                  minHeight: 200,
                                  border: "2px lightgray dashed"
                              }
                          })}
                      >
                          <ol>
                              {files.map(file => (
                                  
                                  <li key={file?.name}><FolderIcon className="w-5 h-7"/>{file.name}</li>
                              ))}
                              {/* {errors.map(error => (
                                  <li key={error?.id} className="text-red-200">
                                      {error.file ? (
                                          <span >
                                              {error.file.name} - {error.type}
                                          </span>
                                      ) : (
                                          error.type
                                      )}
                                  </li>
                              ))} */}
                          </ol>
                      </div>
                      <div>
                          Dragging not convenient?{" "}  
                          <button onClick={browseFiles} style={{color: "blue"}}> Click here</button> to select file.
                      </div>
                      <button className="button button__md button__primary w-full mt-6">Create New Quote</button>
                  </div>
              );
          }}
        </Files>
        </div>
      </AppLayout>
    </>
  );
};

export async function getServerSideProps(context) {
  return {
    props: {
      session: await getSession(context),
    },
  };
}

export default Page;
