FROM quay.io/keycloak/keycloak:latest AS builder

ENV KC_DB=postgres

WORKDIR /opt/keycloak
RUN /opt/keycloak/bin/kc.sh build

FROM quay.io/keycloak/keycloak:latest
COPY --from=builder /opt/keycloak/ /opt/keycloak/

ENV KC_DB=postgres
ENTRYPOINT ["/opt/keycloak/bin/kc.sh"]
