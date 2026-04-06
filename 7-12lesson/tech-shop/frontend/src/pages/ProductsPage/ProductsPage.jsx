import { useEffect, useState } from "react";

import { api } from "../../api";
import ProductModal from "../../components/ProductModal";
import ProductsList from "../../components/ProductsList";
import UserModal from "../../components/UserModal";
import UsersList from "../../components/UsersList";
import "./ProductsPage.scss";

function getApiErrorMessage(error, fallbackMessage) {
  return error?.response?.data?.error || fallbackMessage;
}

const ROLE_LABELS = {
  user: "Пользователь",
  seller: "Продавец",
  admin: "Администратор",
};

export default function ProductsPage({ currentUser, onLogout }) {
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productIdQuery, setProductIdQuery] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [editingProduct, setEditingProduct] = useState(null);
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const isSeller = currentUser.role === "seller";
  const isAdmin = currentUser.role === "admin";
  const canManageProducts = isSeller || isAdmin;
  const canDeleteProducts = isAdmin;

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    if (isAdmin) {
      loadUsers();
    }
  }, [isAdmin]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setErrorMessage("");
      const data = await api.getProducts();
      setProducts(data);
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, "Не удалось загрузить список товаров."));
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      setLoadingUsers(true);
      setErrorMessage("");
      const data = await api.getUsers();
      setUsers(data);
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, "Не удалось загрузить список пользователей."));
    } finally {
      setLoadingUsers(false);
    }
  };

  const openCreate = () => {
    setModalMode("create");
    setEditingProduct(null);
    setModalOpen(true);
  };

  const openEdit = (product) => {
    setModalMode("edit");
    setEditingProduct(product);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingProduct(null);
  };

  const openUserEdit = (user) => {
    setEditingUser(user);
    setUserModalOpen(true);
  };

  const closeUserModal = () => {
    setEditingUser(null);
    setUserModalOpen(false);
  };

  const handleView = async (productId) => {
    try {
      setLoadingDetails(true);
      setErrorMessage("");
      const product = await api.getProductById(productId);
      setSelectedProduct(product);
      setProductIdQuery(productId);
    } catch (error) {
      setSelectedProduct(null);
      setErrorMessage(getApiErrorMessage(error, "Не удалось получить товар по id."));
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleFindById = async (event) => {
    event.preventDefault();

    if (!productIdQuery.trim()) {
      setErrorMessage("Введите id товара.");
      return;
    }

    await handleView(productIdQuery.trim());
  };

  const handleDelete = async (id) => {
    const shouldDelete = window.confirm("Удалить товар?");
    if (!shouldDelete) {
      return;
    }

    try {
      setErrorMessage("");
      await api.deleteProduct(id);
      setProducts((prev) => prev.filter((product) => product.id !== id));
      setFeedbackMessage("Товар успешно удален.");

      if (selectedProduct?.id === id) {
        setSelectedProduct(null);
      }
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, "Не удалось удалить товар."));
    }
  };

  const handleSubmitModal = async (payload) => {
    try {
      setErrorMessage("");
      setFeedbackMessage("");

      if (modalMode === "create") {
        const createdProduct = await api.createProduct(payload);
        setProducts((prev) => [createdProduct, ...prev]);
        setFeedbackMessage("Товар успешно создан.");
      } else {
        const updatedProduct = await api.updateProduct(payload.id, payload);
        setProducts((prev) =>
          prev.map((product) => (product.id === updatedProduct.id ? updatedProduct : product))
        );

        if (selectedProduct?.id === updatedProduct.id) {
          setSelectedProduct(updatedProduct);
        }

        setFeedbackMessage("Товар успешно обновлен.");
      }

      closeModal();
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, "Не удалось сохранить товар."));
    }
  };

  const handleSubmitUser = async (payload) => {
    try {
      setErrorMessage("");
      setFeedbackMessage("");
      const updatedUser = await api.updateUser(payload.id, payload);
      setUsers((prev) => prev.map((user) => (user.id === updatedUser.id ? updatedUser : user)));
      setFeedbackMessage("Данные пользователя обновлены.");
      closeUserModal();
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, "Не удалось обновить пользователя."));
    }
  };

  const handleBlockUser = async (userId) => {
    const shouldBlock = window.confirm("Заблокировать пользователя?");
    if (!shouldBlock) {
      return;
    }

    try {
      setErrorMessage("");
      const blockedUser = await api.blockUser(userId);
      setUsers((prev) => prev.map((user) => (user.id === blockedUser.id ? blockedUser : user)));
      setFeedbackMessage("Пользователь заблокирован.");
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, "Не удалось заблокировать пользователя."));
    }
  };

  return (
    <div className="dashboard">
      <header className="dashboardHeader">
        <div>
          <h1>Управление Tech Shop</h1>
        </div>

        <div className="userPanel">
          <div className="userPanel__card">
            <div className="userPanel__label">Текущий пользователь</div>
            <div className="userPanel__name">
              {currentUser.first_name} {currentUser.last_name}
            </div>
            <div className="userPanel__email">{currentUser.email}</div>
            <div className="pill userPanel__role">{ROLE_LABELS[currentUser.role] ?? currentUser.role}</div>
          </div>

          <button type="button" className="ghostButton" onClick={onLogout}>
            Выйти
          </button>
        </div>
      </header>

      <main className="dashboardMain">
        <section className="workspace">
          <div className="toolbar">
            <div>
              <div className="sectionLabel">Товары</div>
              <h2>Каталог</h2>
            </div>

            {canManageProducts ? (
              <button className="primaryButton" onClick={openCreate}>
                Создать товар
              </button>
            ) : null}
          </div>

          <div className="permissionNote">
            Ваша роль: <strong>{ROLE_LABELS[currentUser.role] ?? currentUser.role}</strong>.{" "}
            {currentUser.role === "user"
              ? "Доступен только просмотр товаров."
              : currentUser.role === "seller"
                ? "Доступно создание и редактирование товаров."
                : "Доступно управление товарами и пользователями."}
          </div>

          <form className="lookupPanel" onSubmit={handleFindById}>
            <label className="lookupPanel__field">
              Найти товар по id
              <input
                className="lookupPanel__input"
                value={productIdQuery}
                onChange={(event) => setProductIdQuery(event.target.value)}
                placeholder="Введите id товара"
              />
            </label>

            <button className="secondaryButton" type="submit" disabled={loadingDetails}>
              {loadingDetails ? "Поиск..." : "Получить товар"}
            </button>
          </form>

          {feedbackMessage ? (
            <div className="statusBanner statusBanner--success">{feedbackMessage}</div>
          ) : null}
          {errorMessage ? (
            <div className="statusBanner statusBanner--error">{errorMessage}</div>
          ) : null}

          {loading ? (
            <div className="emptyState">Загрузка списка товаров...</div>
          ) : (
            <ProductsList
              products={products}
              canDelete={canDeleteProducts}
              canEdit={canManageProducts}
              onView={handleView}
              onEdit={openEdit}
              onDelete={handleDelete}
            />
          )}
        </section>

        <aside className="detailsCard">
          <div className="sectionLabel">Детальная информация</div>
          <h3>Товар по id</h3>

          {selectedProduct ? (
            <div className="detailsContent">
              <div className="detailsRow">
                <span>ID</span>
                <strong>{selectedProduct.id}</strong>
              </div>
              <div className="detailsRow">
                <span>Название</span>
                <strong>{selectedProduct.title}</strong>
              </div>
              <div className="detailsRow">
                <span>Категория</span>
                <strong>{selectedProduct.category}</strong>
              </div>
              <div className="detailsRow">
                <span>Описание</span>
                <strong>{selectedProduct.description}</strong>
              </div>
              <div className="detailsRow">
                <span>Цена</span>
                <strong>{selectedProduct.price} ₽</strong>
              </div>
            </div>
          ) : (
            <div className="detailsPlaceholder">
              Выберите карточку товара или введите id, чтобы запросить `GET /api/products/:id`.
            </div>
          )}
        </aside>
      </main>

      {isAdmin ? (
        <section className="workspace workspace--users">
          <div className="toolbar">
            <div>
              <div className="sectionLabel">Пользователи</div>
              <h2>Управление учетными записями</h2>
            </div>

            <button className="secondaryButton" onClick={loadUsers} disabled={loadingUsers}>
              {loadingUsers ? "Обновление..." : "Обновить список"}
            </button>
          </div>

          {loadingUsers ? (
            <div className="emptyState">Загрузка пользователей...</div>
          ) : (
            <UsersList users={users} onEdit={openUserEdit} onBlock={handleBlockUser} />
          )}
        </section>
      ) : null}

      <ProductModal
        open={modalOpen}
        mode={modalMode}
        initialProduct={editingProduct}
        onClose={closeModal}
        onSubmit={handleSubmitModal}
      />

      <UserModal
        open={userModalOpen}
        user={editingUser}
        onClose={closeUserModal}
        onSubmit={handleSubmitUser}
      />
    </div>
  );
}
