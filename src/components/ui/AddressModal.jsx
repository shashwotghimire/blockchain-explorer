import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const AddressModal = ({ isOpen, onClose, onSubmit }) => {
  const [address, setAddress] = React.useState("");
  const handleSubmit = () => {
    onSubmit(address);
    onClose();
  };
  if (!isOpen) return null; //is open->true, return null
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg z-60">
        <h2 className="text-xl font-bold mb-4">Enter Ethereum Address</h2>
        <Input
          type="text"
          placeholder="Enter Ethereum Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="border p-2 w-full mb-4"
        />
        <Button onClick={handleSubmit}>Submit</Button>
      </div>
    </div>
  );
};

export default AddressModal;
