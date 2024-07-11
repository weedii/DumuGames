import { RiGameLine } from "react-icons/ri";
import { GoVerified } from "react-icons/go";
import Modal from "./Modal";
import { useState } from "react";

const Footer = () => {
  const [showTerms, setShowTerms] = useState(false);
  const [selectedTrems, setSelectedTrems] = useState(null);
  const [showSSL, setShowSLL] = useState(false);
  const [showCred, setShowCred] = useState(false);

  const termsAndConditions = [
    "-- Terms & Conditions --",
    "Welcome to Dumu Games Limited. By accessing and using our website, you agree to comply with and be bound by the following terms and conditions of use. Please read these terms carefully. If you do not agree with any part of these terms and conditions, please do not use our website.",
    {
      tittle: "Introduction",
      content:
        "- These terms and conditions govern your use of our website and services.\n- By using our website, you accept these terms and conditions in full.\n- If you disagree with these terms and conditions or any part of these terms and conditions, you must not use our website.",
    },
    {
      tittle: "License to Use Website",
      content:
        "- Unless otherwise stated, Dumu Games Limited andor its licensors own the intellectual property rights in the website and material on the website.\n- You may view, download for caching purposes only, and print pages from the website for your own personal use, subject to the restrictions set out below and elsewhere in these terms and conditions.",
    },
    {
      tittle: "Acceptable Use",
      content:
        "- You must not use our website in any way that causes, or may cause, damage to the website or impairment of the availability or accessibility of the website.\n- You must not use our website in any way which is unlawful, illegal, fraudulent, or harmful.",
    },
    {
      tittle: "Products and Services",
      content:
        "- We provide digital game codes and gift cards for various platforms and services.\n- All purchases are subject to availability and confirmation of the order price.",
    },
    {
      tittle: "Refunds and Cancellations",
      content:
        "- Please refer to our Refund Policy for information on refunds and cancellations.",
    },
    {
      tittle: "Limitation of Liability",
      content:
        "- Nothing in these terms and conditions will exclude or limit any warranty implied by law that it would be unlawful to exclude or limit.\n- Dumu Games Limited will not be liable to you in respect of any losses arising out of any event or events beyond our reasonable control.",
    },
    {
      tittle: "Variation",
      content:
        "- We may revise these terms and conditions from time-to-time.\n- Revised terms and conditions will apply to the use of our website from the date of publication of the revised terms and conditions on our website.",
    },
    {
      tittle: "Governing Law",
      content:
        "- These terms and conditions will be governed by and construed in accordance with the laws of England and Wales.",
    },
    {
      endMsg: "For any questions or concerns, please contact us at ",
      email: "info@dumugames.com",
    },
  ];

  const refundPolicy = [
    "Refund Policy",
    "At Dumu Games Limited, we are committed to providing our customers with high-quality digital products. If you are not entirely satisfied with your purchase, we are here to help.",
    {
      tittle: "Refund Conditions",
      content:
        "- Refunds will only be provided for digital products that are defective or not as described.\n- Requests for refunds must be made within 3 days of purchase.",
    },
    {
      tittle: "How to Request a Refund",
      content:
        "- To request a refund, please contact our customer support team at info@dumugames.com with your order details and the reason for the refund request.\n- We will review your request and notify you of the status of your refund within 5 business days.",
    },
    {
      tittle: "Refund Process",
      content:
        "- If your refund is approved, we will initiate a refund to your original method of payment.\n- You will receive the credit within a certain amount of days, depending on your card issuer's policies.",
    },
    {
      tittle: "Non-Refundable Items",
      content:
        "- Digital products that have been used or redeemed cannot be refunded.\n- Gift cards are non-refundable.",
    },
    {
      endMsg: "For any questions or concerns, please contact us at ",
      email: "info@dumugames.com",
    },
  ];

  const privacyPolicy = [
    "Privacy Policy",
    "At Dumu Games Limited, we are committed to protecting and respecting your privacy. This policy explains how we collect, use, and protect your personal information.",
    {
      tittle: "Information We Collect",
      content:
        "- We may collect and process the following data about you:\n * Information you provide by filling in forms on our website.\n * Details of transactions you carry out through our website.\n * Information about your visits to our website and the resources you access.",
    },
    {
      tittle: "Use of Your Information",
      content:
        "- We use the information we collect to:\n * Provide you with information, products, or services that you request from us.\n * Carry out our obligations arising from any contracts entered into between you and us.\n * Notify you about changes to our service.",
    },
    {
      tittle: "Disclosure of Your Information",
      content:
        "- We may disclose your personal information to third parties:\n * If we are under a duty to disclose or share your personal data in order to comply with any legal obligation.\n * To protect the rights, property, or safety of Dumu Games Limited, our customers, or others.",
    },
    {
      tittle: "Security",
      content:
        "- We take appropriate measures to ensure that your data is stored securely and protected from unauthorized access, use, or disclosure.",
    },
    {
      tittle: "Your Rights",
      content:
        "- You have the right to ask us not to process your personal data for marketing purposes.\n- You can exercise your rights by contacting us at info@dumugames.com.",
    },
    {
      tittle: "Changes to Our Privacy Policy",
      content:
        "- Any changes we may make to our privacy policy in the future will be posted on this page.",
    },
    {
      tittle: "",
      content: "",
    },
    {
      endMsg: "For any questions or concerns, please contact us at ",
      email: "info@dumugames.com",
    },
  ];

  const SSLContent = [
    {
      tittle: "Welcome to Dumu Games!",
      content:
        "At Dumu Games, we prioritize the security and privacy of our customers. That's why we've implemented industry-standard security measures, including Secure Sockets Layer (SSL) encryption, to safeguard your personal and financial information when you visit our website.",
    },
    {
      tittle: "What is SSL?",
      content:
        "SSL is a protocol that encrypts the data transmitted between your web browser and our website's server. This encryption ensures that any information you enter on our site, such as login credentials, payment details, and personal information, remains private and protected from unauthorized access.",
    },
    {
      tittle: "Why SSL Matters:",
      content:
        "Data Security: SSL encryption prevents hackers and cybercriminals from intercepting and tampering with the data transmitted between your device and our server. Trust and Confidence: When you see the padlock icon and 'https://' in your browser's address bar, it indicates that our website is secure and that your information is safe. Compliance: SSL encryption is a requirement for websites that handle sensitive data, such as payment information, to comply with data protection regulations and industry standards.",
    },
    {
      tittle: "Our Commitment to Security:",
      content:
        "Extended Validation (EV) SSL Certificate: We've obtained an EV SSL certificate, the highest level of SSL encryption available, to provide you with the utmost security and peace of mind. Continuous Monitoring: Our security team monitors our SSL certificate and website security regularly to ensure that your data remains protected at all times. Transparent Communication: We're committed to transparency regarding our security practices and will promptly notify you of any updates or changes to our SSL certificate or security measures.",
    },
    {
      tittle: "How You Can Verify Our SSL Certificate:",
      content:
        "Look for the padlock icon and 'https://' in your browser's address bar when visiting our website. Click on the padlock icon to view details about our SSL certificate and verify its validity.",
    },
    {
      tittle: "Contact Us:",
      content:
        "If you have any questions or concerns about our SSL certificate or website security, please don't hesitate to contact our customer support team. We're here to help and ensure that your experience with Dumu Games is safe and enjoyable.",
    },
  ];

  return (
    <footer className="bg-[#ecf5ff] border-t-2 border-t-black">
      <div className="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8">
        <div className="md:flex md:justify-between">
          <div className="mb-6 md:mb-0">
            <a
              href="/"
              className="text-[#5956E9] text-lg md:text-2xl font-semibold flex items-center hover:opacity-80"
            >
              <RiGameLine className="" />
              DumuGames
            </a>
          </div>

          <div className="flex gap-7">
            <div>
              <h2 className="mb-6 text-sm font-semibold text-gray-700 uppercase">
                Resources
              </h2>
              <ul className="text-gray-500 dark:text-gray-400 font-medium">
                <li
                  className="mb-4 cursor-pointer hover:underline underline-offset-4"
                  onClick={() => {
                    setShowTerms(true);
                    setSelectedTrems(termsAndConditions);
                  }}
                >
                  Terms & Conditions
                </li>
                <li
                  className="mb-4 cursor-pointer hover:underline underline-offset-4"
                  onClick={() => {
                    setShowTerms(true);
                    setSelectedTrems(refundPolicy);
                  }}
                >
                  Refund Policy
                </li>
                <li
                  className="mb-4 cursor-pointer hover:underline underline-offset-4"
                  onClick={() => {
                    setShowTerms(true);
                    setSelectedTrems(privacyPolicy);
                  }}
                >
                  Privacy Policy
                </li>
                <li
                  className="mb-4 cursor-pointer hover:underline underline-offset-4"
                  onClick={() => {
                    setShowCred(true);
                  }}
                >
                  Company Credentials
                </li>
                <li
                  className="mb-4 cursor-pointer hover:underline underline-offset-4"
                  onClick={() => {
                    setShowSLL(true);
                  }}
                >
                  SSL Certificate
                </li>
              </ul>
            </div>

            <div>
              <h2 className="mb-6 text-sm font-semibold text-gray-700 uppercase">
                Contact
              </h2>
              <ul className="text-blue-500 font-medium">
                <li className="cursor-text hover:opacity-85">
                  <p>info@dumugames.com</p>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />

        <div className="sm:flex sm:items-center sm:justify-between">
          <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
            © 2024{" "}
            <a href="/" className="hover:underline">
              DumuGames™
            </a>
            . All Rights Reserved.
          </span>
        </div>
      </div>

      {selectedTrems && (
        <Modal open={showTerms} onClose={setShowTerms}>
          <div className="p-3 flex flex-col space-y-10 max-w-2xl h-[60vh] overflow-y-scroll">
            <p className="text-xl font-semibold text-red-700">
              {selectedTrems[0]}
            </p>

            <p className="text-xs font-semibold text-red-500">
              {selectedTrems[1]}
            </p>

            {selectedTrems.slice(2).map((item, idx) => (
              <div className="" key={idx}>
                {item.tittle && (
                  <>
                    <p className="text-lg font-semibold text-[#5956E9]">
                      {item.tittle}
                    </p>
                    <pre className="mt-5 text-sm text-wrap">{item.content}</pre>
                  </>
                )}

                {item.endMsg && (
                  <p className="text-sm">
                    {item.endMsg}{" "}
                    <span className="text-blue-400 font-bold">
                      {item.email}
                    </span>
                  </p>
                )}
              </div>
            ))}
          </div>
        </Modal>
      )}

      <Modal open={showSSL} onClose={setShowSLL}>
        <div className="p-3 flex flex-col space-y-10 max-w-2xl h-[60vh] overflow-y-scroll">
          <p className="text-xl font-semibold text-green-700 flex items-center gap-3">
            SSL Certificate <GoVerified />
          </p>

          {SSLContent.map((item, idx) => (
            <div className="" key={idx}>
              <p className="text-lg font-semibold text-[#5956E9]">
                {item.tittle}
              </p>
              <p className="mt-5 text-sm">{item.content}</p>
            </div>
          ))}
          <p className="text-sm text-emerald-500">
            Thank you for trusting Dumu Games for your gaming needs. We
            appreciate your business and value your security and privacy.
          </p>
        </div>
      </Modal>

      <Modal open={showCred} onClose={setShowCred}>
        <div className="p-3 flex flex-col space-y-10 max-w-2xl h-[60vh] overflow-y-scroll">
          <p className="text-xl font-semibold text-red-700">
            Company Credentials
          </p>

          <p className="mt-5 text-sm">
            Welcome to Dumu Games Limited. Established with a commitment to
            excellence, we specialize in offering a diverse range of digital
            products, focusing primarily on game codes and digital gift cards.
            Registered under company number 15104371, Dumu Games Limited was
            officially incorporated on 30th August 2023 as a private limited
            company. Our registered office is centrally located at 71-75 Shelton
            Street, Covent Garden, London, WC2H 9JQ, UNITED KINGDOM. Our mission
            is to provide gamers and digital product enthusiasts with a reliable
            and secure platform for purchasing high-quality digital goods. Led
            by a passion for innovation and customer satisfaction, we
            continually strive to expand our offerings and enhance our services
            to meet the evolving needs of our valued customers.
          </p>
        </div>
      </Modal>
    </footer>
  );
};

export default Footer;
