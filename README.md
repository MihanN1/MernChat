# MernChat Repository Documentation
The project will have a name when it is FULLY up and running. Will have to change github, a lot of things in the code itself, coderabbit company name, email domain.

This file contains three documents:

1. **README.md**
2. **Terms of Use (ToU)**
3. **Code of Conduct (CoC)**
4. **Privacy Policy (PP)**

---

# 1. README.md

## 📌 Project: MernChat

A full‑stack MERN real‑time chat application currently undergoing a large-scale redesign, refactoring, functional expansion, and modernization.

---

## 📖 Short Description

MernChat is a modern messaging platform inspired by Discord-style communication. It supports real‑time chats, user accounts, notifications, multi-language support, future calling functionality, and planned advanced features like chat folders, friend system, audio/video calls, screen sharing, and full UI rework.

This document outlines the structure, technology stack, update roadmap, contribution guidelines, and future plans.

---

## 🧩 Tech Stack & Services Used

### **Frontend**

* React
* Redux / Context (depending on component)
* React Router
* TailwindCSS
* WebSockets / Socket.IO client
* REST API client (Axios/Fetch)
* Planned: theme system, custom navigation animation

### **Backend**

* Node.js
* Express.js
* MongoDB + Mongoose
* Socket.IO server
* JWT authentication

### **Infrastructure**

* Planned: Docker containerization
* Planned: CI/CD
* Planned: SEO improvements

### **Architecture Overview**

* **Client** → SPA routing + custom navigation animations + persistent themes/languages
* **Server** → Modular Express structure + versioned API + real-time socket engine
* **Database** → Mongo models for users, chats, messages, notifications, friends

### **.env THINGS**
* **PORT:** the port backend app will run on if NODE_ENV === development.
* **CLIENT_URL:** the link that the website will run on if NODE_ENV === development.
* **NODE_ENV:** the mode of running the app. Development will run locally, production - normally).
* **JWT_SECRET, JWT_TEMP_SECRET:** a string to generate a secure token, a key for jwt token(for logging in) and temporary jwt token(for 2FA) respectively.
* **RESEND_API_KEY:** an API key required for emailing to work.
* **EMAIL_FROM, EMAIL_FROM_PROD:** the email address the emails are gonna be sent from in development/production.
* **EMAIL_FROM_NAME:** the name on the letter.
* **CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, CLOUDINARY_CLOUD_NAME:** the things cloudinary needs in order to connect to the website.
* **ARCJET_KEY:** the key in order for the security functions to work properly.
* **MONGO_URI:** the URI for connecting to MONGO database.

### **Dependencies**
**Frontend:**
```
frontend@0.0.0 Path\to\MernChat\frontend
├── @eslint/js@9.38.0
├── @types/react-dom@19.2.2
├── @types/react@19.2.2
├── @vitejs/plugin-react@5.0.4
├── autoprefixer@10.4.21
├── axios@1.13.2
├── daisyui@4.12.24
├── eslint-plugin-react-hooks@5.2.0
├── eslint-plugin-react-refresh@0.4.24
├── eslint@9.38.0
├── globals@16.4.0
├── lucide-react@^0.553.0
├── postcss@8.5.6
├── react-dom@19.2.0
├── react-hot-toast@^2.6.0
├── tailwindcss@3.4.18
├── vite@7.1.12
└── zustand@5.0.3
```

**Backend:**
```
backend@1.0.0 Path\to\MernChat\backend
├── @arcjet/inspect@1.0.0-beta.10
├── @arcjet/node@1.0.0-beta.10
├── bcryptjs@2.4.3
├── cloudinary@2.5.1
├── cookie-parser@1.4.7
├── UNMET DEPENDENCY cors@^2.8.5
├── dotenv@16.4.7
├── express@4.21.2
├── jsonwebtoken@9.0.2
├── mongoose@8.10.1
├── resend@6.0.2
└── socket.io@^4.8.1
```

---

## 🚀 Update Structure (Roadmap Overview)

Versions planned from **1.0.x** to **2.5.x**:

### **[1.0.x — Account System Update - BEING DEVELOPED RN](https://github.com/MihanN1/MernChat/releases/tag/email-account-updates)**

* Refactor email system
* Account recovery
* 2FA
* Login with QR
* Custom  domain(and a working server for it)
* Validation error (“ does not exist”)

### **1.1.x — Chats Update**

* Notification frontend changes
* Editable & removable messages
* Group chats basics
* Chat deletion
* Replying

### **1.2.x — Profile Update**

* Bio
* Animated avatar
* Banner
* Name in groups
* Tagging

### **1.3.x — Calls Update**

* Voice calls
* Video calls
* Screen sharing
* Timestamps

### **1.4.x — Settings Update**

* Navigation animation
* Audio settings: mic, headphones, noise suppression, listen-to-yourself-to-check-your-devices button.
* Language selector (persistent)
* Theme selector (persistent, all pages)
* Newsletter checkboxes

### **1.5.x — Messaging & Misc**

* Audio messages
* Video messages
* Branches/threads
* Links settings
* Forwarding settings
* Message links
* Message search by filters
* Message search by phrase
* Reactions
* Improved cookies system: full refusal, selective cookies, new cookies where needed

### **1.6.x — Referral System**

* Humorous referral rewards messages (“Wanted rewards?…”)
* No actual rewards tho, as this is not for monetisation yet and there are no subscriptions or features that require them.

### **1.7.x — Webhooks**

* Custom events
* External integrations

### **1.8.x — People Update**

* Proper friend list
* No “all users in the world” display
* Blocking
* Friend nicknames
* Email receiving with Resend(for reporting bugs)
* Reporting(AND admin panel for banning the user and looking through reports)

### **1.9.x — Text Formatting**

* Markdown-like formatting
* Discord/GitHub text formatting, message formating(spoilers, etc)
* Fonts and rich text support

### **2.0.x — Heavy Optimization**

* Performance improvements
* Database indexing
* Caching

### **2.1.x — Security Update**

* Permission system overhaul
* Security updates(might be implemented during development, rather than doing it further in the project)
* Privacy settings
* Suspicious login detection

### **2.2.x — Containerization**

* Docker & orchestrations

### **2.3.x — SEO Update**

* Server-side rendering or pre-rendering
* Sitemap, metadata

### **2.4.x — Application Build**

* Desktop app(for Windows, Linux and MacOS)
* Mobile app(both IOS and Android)
* Mobile website design
* Tray system
* Notifications

### **2.5.x — Final Release Preparation**

* Installer building
* Well, A NAME FOR THIS PROJECT.
* Final optimization
* Post-production website (like Discord download page)
* A hella lot of hotfixes because im a little stupid)
* API function for customization

---

## 🔧 Future Update Plans (Extra)

* Last‑seen indicators
* Turning sounds off and on(muting)
* Making tag notifications toggable
* Status updates
* Tags: `@everyone`, `@here`(might be implemented in 1.2.x)
* Better UI text, rewritten labels
* Page transitions without reloads (YouTube-style) or custom animation
* Video screen-demo prototypes
* “Delete for me / delete for all” message removal
* Sounds overhaul
* Up-to-date modules & dependency upgrades
* Custom error pages

---

## 📬 Contacts

*(Placeholder — contacts will be added later, right now you can contact me through krutoysansn1@gmail.com email, as i am the only developer of this)*
For now its place where you share bugs, issues, send reports and security concerns for your accounts, if this website even made it to production.

---

## 🤝 How Others Can Help

* Create issues with clear descriptions
* Submit pull requests for:
  * UI fixes
  * Code refactoring
  * Optimization
  * Accessibility
  * Typos, spacing, semicolons
* Help test new versions
* Suggest features

---

## 📘 License & Permissions

MernChat is licensed under the **MIT License** unless updated later.
You may:

* Use the code freely
* Modify and distribute it
* Submit improvements

You must:

* Keep copyright notices
* Respect ToU, PP and CoC

---

## 🔄 How README Will Be Updated

* Updated after each major version change
* New features added to roadmap
* Architecture section updated after each refactor
* UI/UX and services list will be refreshed

---

# 2. Terms of Use (ToU)

## 1. Acceptance

By using the MernChat platform, you agree to comply with these Terms of Use.

## 2. Allowed Use

You may use the service for personal and non-commercial communication.

## 3. Prohibited Activities

* Harassment or abuse of users
* Illegal content distribution
* Attempting to breach platform security
* Reverse engineering backend systems

## 4. Accounts

Users are responsible for protecting their login information.
Planned features such as 2FA, QR login, and recovery will improve security.

## 5. Content Ownership

Users retain ownership of messages they send.
MernChat does not sell or misuse user data.

## 6. Liability

MernChat is provided “as is”. The creators are not responsible for data loss, downtime, or misuse.

## 7. Changes to Terms

These Terms may be updated at any time. Future updates will be listed in the README.

---

# 3. Code of Conduct (CoC)

## 1. Respect

All users must treat others respectfully. No hate speech, harassment, or abuse.

## 2. Safety

Users must not share harmful content or attempt to compromise others’ security.

## 3. Integrity

No impersonation, scams, phishing, or malicious links.

## 4. Collaboration

Contributors should:

* Write clear, readable code
* Follow repository formatting rules
* Add comments and meaningful commit messages

## 5. Reporting

Users can report issues or abusive behavior via the repository's issue tracker, **BUT** reporting via the web application itself will be added later.

## 6. Enforcement

Violation of this Code may lead to warnings, account limitations, or removal.

---

## **MernChat Privacy Policy**

MernChat is committed to protecting your privacy and ensuring your data is handled securely. This brief policy explains what information we collect and how it is used.

### **1. Information We Collect**

* **Account Information:** Email, username, and any profile details you provide.
* **Messages & Media:** All messages and shared content are stored securely and used only for providing the chat service.
* **Technical Data:** Basic logs such as IP address, device type, and usage analytics to improve performance.

### **2. How We Use Your Information**

* To enable messaging and communication features.
* To maintain account security and prevent abuse.
* To improve app performance and user experience.

### **3. Data Sharing**

We do **not** sell or share your personal data with third parties except when required by law or to maintain service functionality.

### **4. Security**

All stored data is protected using modern security practices. We continuously work to keep your information safe.

### **5. Your Rights**

You may request deletion of your data or your account at any time.

---

End of documents.
