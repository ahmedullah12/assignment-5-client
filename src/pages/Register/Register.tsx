import MyForm from "@/components/form/MyForm";
import MyInput from "@/components/form/MyInput";
import { Button } from "@/components/ui/button";
import { useRegisterMutation } from "@/redux/features/auth/authApi";
import { setUser, TUser } from "@/redux/features/auth/authSlice";
import { useAppDispatch } from "@/redux/hook";
import verifyJwt from "@/utils/verifyJwt";
import { FieldValues, SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const [register] = useRegisterMutation();

  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    const registerData = {
      ...data,
      role: "user",
    };

    try {
      const res = await register(registerData).unwrap();
      const userData = verifyJwt(res.data.accessToken) as TUser;
      dispatch(setUser({ user: userData, token: res.data.accessToken }));
      toast.success(res.message);
      navigate("/");
    } catch (err: any) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-accent overflow-y-auto relative">
      <div className="absolute top-2 left-4">
        <Link to="/" className="flex items-center gap-2">
          <MdOutlineKeyboardBackspace color="#674188" className="mt-1" size={30}/>
          <span className="text-xl text-primary font-semibold ">Back to Home</span>
        </Link>
      </div>
      <div className="w-full md:w-[500px] px-4">
        <div className="bg-white shadow-lg rounded-lg px-10 py-8">
          <h1 className="mb-6 font-semibold text-2xl text-primary">
            Create Account
          </h1>

          <MyForm onSubmit={onSubmit}>
            <MyInput width="max-w-[300px]" name="name" type="text" label="Name" />
            <MyInput width="max-w-[300px]" name="email" type="text" label="Email" />
            <MyInput width="max-w-[300px]" name="phone" type="text" label="Phone Number" />
            <MyInput width="max-w-[300px]" name="address" type="text" label="Address" />
            <MyInput width="max-w-[300px]" name="password" type="password" label="Password" />
            <Button className="bg-primary ">Register</Button>
          </MyForm>

          <p className="text-center mt-6 text-sm text-gray-500">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-medium underline">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
