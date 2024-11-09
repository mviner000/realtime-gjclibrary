"use client";
import { Account } from "@/types";
import React, { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { env } from "@/env";
import { LoadingState } from "@/constants/loading-state";

const ActivatedAccountsPage: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await fetch(
          `${env.NEXT_PUBLIC_API_URL}/accounts/activated`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setAccounts(data.accounts);
      } catch (error) {
        setError("Failed to fetch accounts");
        console.error("Error fetching accounts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, []);

  if (loading) return <LoadingState />;
  if (error) return <div>{error}</div>;

  return (
    <div className="w-full flex flex-col justify-center items-center mt-10">
      <div className="flex flex-col mx-auto mb-6 space-y-2">
        <h1>Activated Accounts</h1>
        <ul>
          {accounts.map((account: Account) => (
            <li key={account.school_id}>
              <div className="flex gap-4">
                <h2>{`${account.first_name || ""} ${
                  account.last_name || ""
                }`}</h2>
                <p>
                  <strong>Course:</strong> {account.course}
                </p>
                <span>
                  
                  {formatDistanceToNow(new Date(account.activation_date ?? ""))
                    ? `${formatDistanceToNow(
                        new Date(account.activation_date ?? "")
                      )} ago`
                    : "N/A"}
                </span>

                {account.image && (
                  <img
                    src={account.image}
                    alt={`${account.first_name} ${account.last_name}`}
                  />
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ActivatedAccountsPage;