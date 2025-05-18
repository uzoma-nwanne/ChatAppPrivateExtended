import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { GroupIcon, MegaphoneIcon, Loader2 } from "lucide-react";
import { useChatStore } from "../store/useChatStore";

const CreateGroup = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const navigate = useNavigate();
  const { isCreatingRoom, createRoom } = useChatStore();

  const validateForm = () => {
    if (!formData.name.trim()) return toast.error("Group name is required");
    if (!formData.description.trim())
      return toast.error("Description is required");
    if (formData.description.length < 6)
      return toast.error("Description must be at least 6 characters");

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = validateForm();
    let res;
    if (success === true) {
      res = await createRoom(formData);
    }
    if (res) navigate("/");
  };

  return (
    <div className="min-h-screen bg-base-100 pt-20">
      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-base-300 rounded-xl p-6 space-y-8">
          <div className="w-full max-w-md space-y-8 mx-auto">
            {/* LOGO */}
            <div className="text-center mb-8">
              <div className="flex flex-col items-center gap-2 group">
                <div
                  className="size-12 rounded-xl bg-primary/10 flex items-center justify-center 
                      group-hover:bg-primary/20 transition-colors"
                >
                  <GroupIcon className="size-6 text-primary" />
                </div>
                <h1 className="text-2xl font-bold mt-2">Create Group</h1>
                <p className="text-base-content/60">
                  Get a new group with description
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Name</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <GroupIcon className="size-5 text-base-content/40" />
                  </div>
                  <input
                    type="text"
                    className={`input input-bordered w-full pl-10`}
                    placeholder="Group Name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Description</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MegaphoneIcon className="size-5 text-base-content/40" />
                  </div>
                  <input
                    type="text"
                    className={`input input-bordered w-full pl-10`}
                    placeholder="description"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        description: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={isCreatingRoom}
              >
                {isCreatingRoom ? (
                  <>
                    <Loader2 className="size-5 animate-spin" />
                    Loading...
                  </>
                ) : (
                  "Create Account"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateGroup;
