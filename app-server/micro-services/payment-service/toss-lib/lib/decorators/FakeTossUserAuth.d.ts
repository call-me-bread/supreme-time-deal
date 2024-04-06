import { FastifyRequest } from "fastify";
export declare function FakeTossUserAuth(): ParameterDecorator;
export declare namespace FakeTossUserAuth {
    function authorize(request: FastifyRequest): void;
}
