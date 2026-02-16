import React, { useState } from "react";
import { useAuthContext } from "../../context/AuthContext";
import Input from "../../components/shared/Input";
import { useEditUser } from "../../lib/react-query/mutations/mutations";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router";

const Settings = () => {
  const { first_name, last_name, email, user_id } = useAuthContext();
  const navigate = useNavigate();

  let { id } = useParams();


  const [changedData, setChangedData] = useState({
    first_name: first_name,
    last_name: last_name,
    email: email,
  });

  const { mutateAsync: editUser, isPending } = useEditUser();

  const handleBack = () => {
    navigate(-1);
  };

  const handleInputs = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setChangedData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { first_name, last_name, email } = changedData;

    
    const isFormEmpty = [first_name, email].some(
      (value) => value.trim() === ""
    );

    // const isFormEmpty = Object.values(changedData).some(
    //   (value) => value === "" || value.length <= 0
    // );

    if (isFormEmpty) {
      return toast.error("Please fill in the form provided.");
    }

    try {
      await editUser({
        email: email,
        first_name: first_name,
        last_name: last_name,
        auth_user_id: user_id,
        param_user_id: id,
      });
      toast.success("User information updated successfully!");
      handleBack();
    } catch (error) {
      toast.error(`${error}`);
    }
  };

  return (
    <section className="font-paragraph text-white p-4 max-w-6xl mx-auto">
      <div className="">
        <h1 className="font-header text-3xl font-bold">Account</h1>
      </div>

      <hr className="my-4 opacity-50" />
      <form onSubmit={handleSubmit}>
        <fieldset className="flex flex-col gap-y-20">
          <div className="grid grid-cols-2 max-w-[70rem]">
            {/* <div className="">
              <p className="text-lg font-header">
                Change your profile picture.
              </p>
              <p className="opacity-50 text-sm">
                Note that it will take a few second ~ minutes to update
              </p>
            </div> */}

            {/* <div className="flex flex-row gap-2 items-center">
              <div className="w-12 h-12 rounded-full bg-slate-500 flex justify-center items-center">
                <span className="select-none text-xl">
                  {first_name.slice(0, 1)}
                </span>
              </div>
              <div>
                <p>Profile Picture</p>
                <p className="text-sm opacity-50">PNG, JPG Under 5MB</p>
              </div>
              <div className="space-x-4 ml-4">
                <button className="px-2 py-1 rounded-lg border border-white/50">
                  Upload a new picture
                </button>
                <button className="px-2 py-1 rounded-lg bg-red-500">
                  Delete
                </button>
              </div>
            </div> */}
          </div>
          <div className="grid grid-cols-2 max-w-[70rem]">
            <div className="">
              <p className="text-lg font-header">Change your username.</p>
              <p className="opacity-50 text-sm">
                Note that it will take a few second ~ minutes to update
              </p>
            </div>

            <div className="block space-y-4">
              <Input
                name="first_name"
                placeholder="First name"
                type="text"
                text="First Name"
                value={changedData.first_name}
                onChange={handleInputs}
                min={undefined}
                max={undefined}
              />
              <Input
                name="last_name"
                placeholder="Last name"
                type="text"
                text="Last Name"
                value={changedData.last_name}
                onChange={handleInputs}
                min={undefined}
                max={undefined}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 max-w-[70rem]">
            <div className="">
              <p className="text-lg font-header">Change your email.</p>
              <p className="opacity-50 text-sm">
                Note that it will take a few second ~ minutes to update
              </p>
            </div>

            <div className="block">
              <Input
                name="email"
                placeholder="Email"
                type="email"
                text="Email"
                onChange={handleInputs}
                value={changedData.email}
                min={undefined}
                max={undefined}
              />
            </div>
          </div>

          <div className="flex gap-2 ml-auto">
            <button
              disabled={isPending}
              className="px-2 py-1 rounded-lg border border-white/50"
            >
              {isPending ? "Saving changes..." : "Save Changes"}
            </button>
            <button
              className="px-2 py-1 rounded-lg bg-red-500"
              type="button"
              onClick={handleBack}
            >
              Cancel
            </button>
          </div>
        </fieldset>
      </form>

      {/* 
      <div className="flex flex-row items-center gap-10">
        <div className="flex flex-row gap-2 items-center">
          <div className="w-20 h-20 rounded-full bg-slate-500 flex justify-center items-center">
            <span className="select-none text-2xl">
              {first_name.slice(0, 1)}
            </span>
          </div>
          <div>
            <p>Profile Picture</p>
            <p className="text-sm opacity-50">PNG, JPG Under 5MB</p>
          </div>
        </div>

        <div className="space-x-4">
          <button className="px-2 py-1 rounded-lg border border-white/50">
            Upload a new picture
          </button>
          <button className="px-2 py-1 rounded-lg bg-red-500">Delete</button>
        </div>
      </div> */}
    </section>
  );
};

export default Settings;
