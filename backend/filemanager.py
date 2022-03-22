import os
import shutil

main_dir = os.environ.get('FILEMANAGER_PATH')


def is_subdir(path, directory):
    path = os.path.realpath(path)
    directory = os.path.realpath(directory)
    relative = os.path.relpath(path, directory)
    return not relative.startswith("..")


def get_path(rel):
    if rel[0] == "/":
        rel = rel[1:]
    path = os.path.join(main_dir, rel)
    if not is_subdir(path, main_dir):
        return None
    return os.path.realpath(path)


def list_directory(src):
    path = get_path(src)
    if path is None:
        return []

    elements = os.listdir(path)
    result = {}
    for el in elements:
        if os.path.isdir(os.path.join(path, el)):
            result[el] = "DIRECTORY"
        else:
            result[el] = "FILE"

    return result


def rename(old, new):
    old_abs = get_path(old)
    if old_abs is None:
        return False
    parent_old = os.path.abspath(os.path.join(old_abs, os.pardir))
    new_abs = get_path(os.path.join(parent_old, new))
    if new_abs is None:
        return False
    try:
        os.rename(old_abs, new_abs)
        return True
    except OSError:
        return False


def upload(file_bytes: bytes, path: str):
    path = get_path(path)
    if path is None:
        return False
    parent_dir = os.path.dirname(path)
    os.makedirs(parent_dir, exist_ok=True)
    with open(path, "wb") as file:
        file.write(file_bytes)
    return True


def delete(path):
    path = get_path(path)
    if path is None:
        return False
    if os.path.isdir(path):
        shutil.rmtree(path)
    else:
        os.remove(path)
    return True
