import { IoMdNotifications } from "react-icons/io";

import styles from "../Styles/Hero.module.css";
import Navbar from "./Navbar";

export default function Hero() {
  return (
    <div className={styles.pageWrapper}>
      <Navbar />

      {/* Hero Section */}
      <div className={styles.heroSection}>
        <div className={styles.heroContent}>
          {/* Chat App Illustration */}
          <div className={styles.illustrationWrapper}>
            <div className={styles.chatBox}>
              <div className={styles.chatHeader}>
                <div className={styles.avatar}>
                  <span>JD</span>
                </div>
                <div>
                  <h3 className={styles.chatName}>John Doe</h3>
                  <p className={styles.chatStatus}>Online</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className={styles.messageIncoming}>
                  Hey! How are you doing today?
                </div>
                <div className={styles.messageOutgoing}>
                  I'm great! Just finished the project.
                </div>
                <div className={styles.messageIncoming}>
                  That's awesome! Can't wait to see it.
                </div>
              </div>
            </div>

            <div className={styles.notificationIcon}>
              <IoMdNotifications />
            </div>
          </div>

          {/* Text Content */}
          <div className={styles.textSection}>
            <h1 className={styles.title}>
              Connect Instantly with WSA Chat APP
            </h1>
            <p className={styles.subtitle}>
              Experience seamless communication with friends and colleagues in a
              secure, modern messaging platform designed for today's connected
              world.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
