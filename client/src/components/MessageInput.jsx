import { Image, Send, X } from "lucide-react";
import styles from "../Styles/MessageInput.module.css";
import { useState, useRef } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";

const MessageInput = () => {
  // const dummyText = "Hello, this is a message!";
  // const dummyImagePreview = "https://i.pravatar.cc/150?img=67"; // placeholder image

  const [text, setText] = useState();
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const { sendMessages } = useChatStore();
  const { getToken } = useAuth();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less that 5MB");
        return;
      }
      setImage(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text && !image) return;

    const token = await getToken({ template: "1_token_vinag" });
    if (!token) return;
    const formData = new FormData();
    if (text) formData.append("text", text);
    if (image) formData.append("image", text);

    await sendMessages(formData, token);
    setText("");
    removeImage();
  };

  return (
    <form className={styles.formContainer} onSubmit={handleSendMessage}>
      {/* Show dummy image preview */}
      {imagePreview && (
        <div className={styles.previewContainer}>
          <img
            src={imagePreview}
            alt="Preview"
            className={styles.previewImage}
          />
          <button
            type="button"
            className={styles.removeButton}
            onClick={removeImage}
          >
            <X size={16} />
          </button>
        </div>
      )}

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.imageButton}
          onClick={() => fileInputRef.current?.click()}
        >
          <Image size={20} />
        </button>
        {/* Hidden file input(not functional in static version) */}
        <input
          type="file"
          hidden
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageChange}
        />
        <input
          type="text"
          value={text}
          placeholder="Type a message..."
          className={styles.textInput}
          onChange={(e) => setText(e.target.value)}
        />
        {/* Send button is enabled since we have dummy content */}
        <button type="submit" className={styles.sendButton}>
          <Send size={20} />
        </button>
      </div>
    </form>
  );
};

export default MessageInput;
