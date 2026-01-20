import os
import sys
import json

def load_env_file(path):
    data = {}
    try:
        with open(path, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if not line or line.startswith("#"):
                    continue
                if "=" in line:
                    k, v = line.split("=", 1)
                    data[k.strip()] = v.strip().strip('"').strip("'")
    except FileNotFoundError:
        pass
    return data


def main():
    # 1) Try environment variable first
    key = "GEMINI_API_KEY"

    # 2) If not present, try ML/.env relative to repo
    if not key:
        repo_root = os.path.dirname(os.path.abspath(__file__))
        env_path = os.path.join(repo_root, "ML", ".env")
        env_data = load_env_file(env_path)
        key = env_data.get("GEMINI_API_KEY")

    if not key:
        print("GEMINI_API_KEY not found in environment or ML/.env")
        print("Set GEMINI_API_KEY and re-run: ")
        print("  py -3.11 APItesting.py")
        sys.exit(2)

    print("Using GEMINI_API_KEY from:",
          "environment" if os.environ.get("GEMINI_API_KEY") else env_path)

    # Try calling the Google Gemini client (used by your project)
    try:
        import google.generativeai as genai

        genai.configure(api_key=key)

        # Primary attempt: use GenerativeModel if available (matches your code)
        try:
            model = genai.GenerativeModel("gemini-2.5-flash")
            resp = model.generate_content("{\n  \"test\": \"gemini_key_check\"\n}")
            # Different library versions expose text/content fields differently
            content = getattr(resp, "text", None) or getattr(resp, "content", None) or str(resp)
            print("SUCCESS: received response from Gemini (GenerativeModel).")
            print(content)
            return
        except Exception as e:
            print("GenerativeModel path failed:", repr(e))

        # Fallback: try genai.generate (older/newer APIs)
        try:
            resp2 = genai.generate(model="gemini-2.5-flash", prompt="{\n  \"test\": \"gemini_key_check\"\n}")
            print("SUCCESS: received response from Gemini (genai.generate).")
            print(resp2)
            return
        except Exception as e:
            print("genai.generate path failed:", repr(e))

        print("All genai call attempts failed. See above errors for details.")

    except Exception as e:
        print("Failed to import or use google.generativeai:", repr(e))
        print("If you don't have the library installed, install it with pip and retry:")
        print("  py -3.11 -m pip install --upgrade google-generativeai")


if __name__ == "__main__":
    main()
