export const sendLoginRequest = async (url: string): Promise<string> => {
  const url_login = `${url}/api/v1/login`;

  const body = {
    username: process.env.DF_MASTER_USERNAME,
    password: process.env.DF_MASTER_PASSWORD,
  };

  const resp = await fetch(url_login, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!resp.ok) {
    return "";
  }
  const result = await resp.json();
  return result.access;
};

export const userVerification = async (
  url: string,
  accessToken: string,
  userEmail: string
): Promise<string> => {
  const url_userList = `${url}/api/v1/list_users`;

  const resp = await fetch(url_userList, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  const result = await resp.json();
  const user = result.find((u: any) => u.email === userEmail);
  if (user) {
    return user.email;
  }
  return "";
};

interface IUserSetting {
  id: number;
  selected_view: string;
  selected_view_driller: string;
}

interface ILoginResponse {
  user_id: string;
  access: string;
  username: string;
  role: string;
  is_active: boolean;
  theme: boolean;
  storage: any; // You can replace `any` with a more specific type if needed
  userSetting: IUserSetting;
}

export const requestLoginByUser = async (
  url: string,
  accessToken: string,
  userEmail: string
): Promise<ILoginResponse | null> => {
  try {
    const resp = await fetch(`${url}/api/v1/grant/access`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: userEmail }),
    });

    if (!resp.ok) return null;
    return await resp.json();
  } catch (err) {
    console.error("Login fetch error:", err);
    return null;
  }
};
