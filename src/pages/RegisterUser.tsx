import { Button, Grid, TextField } from "@material-ui/core";
import { useContext } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import LockIcon from "@mui/icons-material/Lock";
import EmailIcon from "@mui/icons-material/Email";
import EmojiPeopleIcon from "@mui/icons-material/EmojiPeople";
import PhoneIcon from "@mui/icons-material/Phone";
import HomeIcon from "@mui/icons-material/Home";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { registerInfoContext } from "../components/Register/RegisterInfo";
import "../css/registerUser.css";
import { FirebaseTimestamp, auth, db } from "../app/index";
import axios from "axios";
import { registerUserNameContext } from "../components/Register/RegisterUserName";

export function RegisterInfo() {
  const navigate = useNavigate();
  const {
    register,
    formState: { errors },
    trigger,
  } = useForm({
    // form欄の外をクリックするとトリガーが発動するモードに設定する
    mode: "onBlur",
  });

  // ユーザー情報格納先コンテキスト
  const userData = useContext(registerInfoContext);
  const userName = useContext(registerUserNameContext);

  // ユーザー情報をfirebaseに送る
  const sendUserInfo = () => {
    // updateId();
    registerUser().then((result) => {
      navigate("/AfterRegister");
    });
  };

  const mailAddress = userData?.registerData.mailAddress;
  const password = userData?.registerData.password;

  //authnicationへ登録する
  const registerUser = async () => {
    if (mailAddress !== undefined && password !== undefined) {
      // authnicationへ登録
      createUserWithEmailAndPassword(auth, mailAddress, password)
        .then((response) => {
          if (response) {
            // authnicationへ登録できたら、firebaseに登録する
            setUserInfo(response.user.uid);
          }
        })
        .catch((error) => {
          const errorMsg = error.message;
          alert(`登録できませんでした+${errorMsg}`);
        });
    }
  };

  /**
 ユーザーを登録
 **/
  const setUserInfo = async (uid: string) => {
    // IDを取得する
    // const newId = await getDoc(doc(db, "userInfoId", "lastId"));
    const timeStamp = FirebaseTimestamp.now();
    const initialData = {
      created_Time: timeStamp,
      id: uid,
      name: userData?.registerData.name,
      email: userData?.registerData.mailAddress,
      password: userData?.registerData.password,
      zipcode: userData?.registerData.zipcode,
      address: userData?.registerData.address,
      telephone: userData?.registerData.telephone,
    };
    // ユーザー登録
    await db.collection("userInformation").doc(uid).set(initialData);
  };

  // 住所検索
  const searchAddress = async (zipcode: string) => {
    const response = await axios.get("https://zipcoda.net/api", {
      params: { zipcode: zipcode },
    });
    console.dir(JSON.stringify(response));

    userData?.setregisterData({
      ...userData?.registerData,
      address: response.data.items[0].pref + response.data.items[0].address,
    });
  };

  // 名前をregisterInfoに格納する
  const sendUserName = (firstNameData?: string, lastNameData?: string) => {
    const fullName = { lastName: lastNameData, firstName: firstNameData };
    if (fullName || (firstNameData && lastNameData)) {
      userData?.setregisterData({
        id: userData.registerData.id,
        name: fullName,
        mailAddress: userData.registerData.mailAddress,
        password: userData.registerData.password,
        zipcode: userData.registerData.zipcode,
        address: userData.registerData.address,
        telephone: userData.registerData.telephone,
      });
    } else return;
  };

  return (
    <div className="register">
      <Grid container justifyContent="center" alignItems="flex-start">
        <Grid container justifyContent="center" alignItems="flex-start">
          <h1>会員登録フォーム</h1>
        </Grid>
        <span className="containers">
          {/* <form onSubmit={handleSubmit(onSubmit)}> */}
          <form>
            <div className="form-group">
              <label className="col-form-label">
                <EmojiPeopleIcon />
              </label>

              <TextField
                className="textField"
                label="姓"
                variant="outlined"
                required
                type="text"
                {...register("name.lastName", {
                  required: "姓を入力してください",
                })}
                value={userName?.registerName.lastName}
                onChange={(e) => {
                  userName?.setregisterName({
                    ...userName.registerName,
                    lastName: e.currentTarget.value,
                  });
                  sendUserName(
                    userName?.registerName.firstName,
                    e.currentTarget.value
                  );
                  trigger("name.lastName");
                }}
              />
              <TextField
                className="textField"
                label="名"
                variant="outlined"
                required
                type="text"
                {...register("name.firstName", {
                  required: "名を入力してください",
                })}
                value={userName?.registerName.firstName}
                onChange={(e) => {
                  userName?.setregisterName({
                    ...userName.registerName,
                    firstName: e.currentTarget.value,
                  });
                  sendUserName(
                    e.currentTarget.value,
                    userName?.registerName.lastName
                  );
                  trigger("name.firstName");
                }}
              />
              <div id="registerUserErrMsg">{errors.name?.message}</div>
            </div>
            <br />

            <div className="form-group">
              <label className="col-form-label">
                <EmailIcon />
              </label>

              <TextField
                required
                className="textField"
                label="メールアドレス"
                variant="outlined"
                type="text"
                {...register("mailAddress", {
                  required: "メールアドレスを入力してください",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "正しいメールアドレスの形式で入力してください。",
                  },
                })}
                value={userData?.registerData.mailAddress}
                onChange={(e) => {
                  userData?.setregisterData({
                    ...userData?.registerData,
                    mailAddress: e.currentTarget.value,
                  });
                  trigger("mailAddress");
                }}
              />
              <div id="registerUserErrMsg">{errors.mailAddress?.message}</div>
            </div>
            <br />

            <div className="form-group">
              <label className="col-form-label">
                <PhoneIcon />
              </label>

              <TextField
                required
                className="textField"
                label="電話番号"
                variant="outlined"
                type="text"
                {...register("telephone", {
                  minLength: {
                    value: 10,
                    message: "電話番号は10桁以上で入力してください。",
                  },
                  maxLength: {
                    value: 11,
                    message: "電話番号は11桁以内で入力してください。",
                  },
                  required: "電話番号を入力してください",
                })}
                value={userData?.registerData.telephone}
                onChange={(e) => {
                  userData?.setregisterData({
                    ...userData?.registerData,
                    telephone: e.currentTarget.value,
                  });
                  trigger("telephone");
                }}
              />
              <div id="registerUserErrMsg">{errors.telephone?.message}</div>
            </div>
            <br />

            <div className="form-group">
              <label className="col-form-label">
                <LockIcon />
              </label>

              <TextField
                required
                className="textField"
                label="パスワード"
                variant="outlined"
                type="text"
                {...register("password", {
                  required: "パスワードを入力してください",
                  minLength: {
                    value: 5,
                    message: "パスワードは5桁以上で入力してください",
                  },
                })}
                value={userData?.registerData.password}
                onChange={(e) => {
                  userData?.setregisterData({
                    ...userData?.registerData,
                    password: e.currentTarget.value,
                  });
                  trigger("password");
                }}
              />
              <div id="registerUserErrMsg">{errors.password?.message}</div>
            </div>
            <br />

            <div className="form-group">
              <label className="col-form-label">
                <img src="../zipcodeIcon.png" width="25" alt="" />
              </label>
              <TextField
                required
                className="textField"
                label="郵便番号"
                variant="outlined"
                type="text"
                {...register("zipcode", {
                  required: "郵便番号を入力してください",
                  minLength: {
                    value: 5,
                    message: "郵便番号は5桁以上で入力してください",
                  },
                  onBlur: (e) => searchAddress(e.currentTarget.value),
                })}
                value={userData?.registerData.zipcode}
                onChange={(e) => {
                  userData?.setregisterData({
                    ...userData?.registerData,
                    zipcode: e.currentTarget.value,
                  });
                  trigger("zipcode");
                }}
              />
              <div id="registerUserErrMsg">{errors.zipcode?.message}</div>
            </div>
            <br />

            <div className="form-group">
              <label className="col-form-label">
                <HomeIcon />
              </label>
              <TextField
                required
                className="textField"
                label="住所"
                variant="outlined"
                type="text"
                {...register("address", {
                  required: "住所を入力してください",
                  minLength: {
                    value: 3,
                    message: "住所を正しく入力してください",
                  },
                })}
                value={userData?.registerData.address}
                onChange={(e) => {
                  userData?.setregisterData({
                    ...userData?.registerData,
                    address: e.currentTarget.value,
                  });
                  trigger("address");
                }}
              />
              <div id="registerUserErrMsg">{errors.address?.message}</div>
            </div>
            <Grid container justifyContent="center" alignItems="flex-start">
              <Button
                color="inherit"
                type="submit"
                onClick={() => sendUserInfo()}
              >
                送信
              </Button>
            </Grid>
          </form>
        </span>
      </Grid>
    </div>
  );
}
