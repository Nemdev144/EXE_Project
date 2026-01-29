const GOOGLE_SCRIPT_ID = "google-identity-script";

const loadGoogleScript = (): Promise<void> => {
  if (typeof window === "undefined") return Promise.reject(new Error("No window"));
  if (window.google?.accounts?.id) return Promise.resolve();
  if (document.getElementById(GOOGLE_SCRIPT_ID)) {
    return new Promise((resolve, reject) => {
      const existing = document.getElementById(GOOGLE_SCRIPT_ID) as HTMLScriptElement | null;
      if (!existing) {
        reject(new Error("Google script not found"));
        return;
      }
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("Google script failed")));
    });
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.id = GOOGLE_SCRIPT_ID;
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Google script failed"));
    document.head.appendChild(script);
  });
};

export const getGoogleIdToken = async (clientId: string): Promise<string> => {
  if (!clientId) throw new Error("Thiếu Google Client ID");
  await loadGoogleScript();

  return new Promise((resolve, reject) => {
    const google = window.google;
    if (!google?.accounts?.id) {
      reject(new Error("Google Identity Services chưa sẵn sàng"));
      return;
    }

    let settled = false;
    const timeout = window.setTimeout(() => {
      if (!settled) {
        settled = true;
        reject(new Error("Google xác thực quá thời gian"));
      }
    }, 60000);

    google.accounts.id.initialize({
      client_id: clientId,
      callback: (response: { credential?: string }) => {
        if (settled) return;
        settled = true;
        window.clearTimeout(timeout);
        if (!response?.credential) {
          reject(new Error("Không nhận được Google credential"));
          return;
        }
        resolve(response.credential);
      },
    });

    google.accounts.id.prompt((notification: any) => {
      if (settled) return;
      if (notification?.isNotDisplayed?.()) {
        settled = true;
        window.clearTimeout(timeout);
        reject(new Error("Google prompt không hiển thị"));
      }
      if (notification?.isSkippedMoment?.()) {
        settled = true;
        window.clearTimeout(timeout);
        reject(new Error("Google prompt bị bỏ qua"));
      }
    });
  });
};
